const client = require("../database");
const accountSid = "AC32012b2991603516770c9c9dacc81e9a";
const authToken = "75f93c2be38ef471b8c2f18d77b5b27d";
const callclient = require("twilio")(accountSid, authToken);

exports.getRouteById = (req, res, next, id) => {
  client.query(
    `SELECT * FROM ambulanceroutes WHERE id=${id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Ambulance route not found",
        });
      }
      route = result.rows[0];
      route.ambulance_route = undefined;
      route.ambulance_route_buffer = undefined;
      req.amroute = route;
      next();
    }
  );
};

exports.getAccidentById = (req, res, next, id) => {
  client.query(`SELECT * FROM accidents WHERE id=${id}`, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Accident Not Found",
      });
    }
    req.accident = result.rows[0];
    next();
  });
};

exports.getNotificationById = (req, res, next, id) => {
  client.query(`SELECT * FROM notifications WHERE id=${id}`, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Notification not found",
      });
    }
    req.amnotification = result.rows[0];
    next();
  });
};

//create

exports.createAmbulanceRoute = (req, res) => {
  const {
    incident_id,
    route_type,
    ambulance_route,
    isRoadAccident,
    start_location,
    end_location,
  } = req.body;

  client.query(
    `INSERT INTO ambulanceroutes(incident_id, route_type, ambulance_route, start_location, end_location) VALUES('${incident_id}', '${route_type}', ST_GeomFromGeoJSON('{"type":"MultiLineString","coordinates":${ambulance_route}}'), ST_GeomFromGeoJSON('{"type": "Point", "coordinates": ${start_location}}'), ST_GeomFromGeoJSON('{"type": "Point", "coordinates": ${end_location}}')) RETURNING id`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      const ambulance_route_id = result.rows[0].id;

      client.query(
        `UPDATE ambulanceroutes SET ambulance_route_buffer = ST_Buffer(ambulance_route, 0.001) WHERE id=${ambulance_route_id}`,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error in creating buffer",
            });
          }
          console.log("buffer made");
        }
      );

      client.query(
        `SELECT c.officer_id, c.duty_id, trafficofficers.name, trafficofficers.phone, c.duty_location, c.duty_type
        FROM( 
        SELECT a.officer_id, a.is_live, a.id as duty_id, ST_AsGeoJSON(a.duty_location) as duty_location, a.duty_type
              FROM (SELECT * FROM duties WHERE is_live=true) as a, (SELECT * FROM ambulanceroutes WHERE id=${ambulance_route_id}) as b
              WHERE ST_Within(a.duty_location, b.ambulance_route_buffer)
        ) as c
        LEFT JOIN trafficofficers
        ON c.officer_id = trafficofficers.id`,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error in Finding Officers Present on the Route",
            });
          }
          const officers = result.rows;
          result.rows.map((results, index) => {
            client.query(
              `INSERT INTO notifications(ambulance_route_id, officer_id, duty_id) VALUES(${ambulance_route_id},${results.officer_id},${results.duty_id})`,
              (err, result) => {
                if (err) {
                  return res.status(400).json({
                    error:
                      "Error in making notifications for selected officers",
                  });
                }
              }
            );
          });
          result.rows.map((results, index) => {
            callclient.calls
              .create({
                url: "http://127.0.0.1:1337/",
                to: `+91${results.phone}`,
                from: "+12056273855",
              })
              .then((call) => console.log(call.sid))
              .catch((err) => console.log(err));
          });

          if (isRoadAccident && route_type == "to_hospital") {
            client.query(
              `INSERT INTO accidents(ambulance_route_id, accident_location, hospital_location) VALUES(${ambulance_route_id}, ST_GeomFromGeoJSON('{"type": "Point", "coordinates": ${start_location}}'), ST_GeomFromGeoJSON('{"type": "Point", "coordinates": ${end_location}}')) RETURNING id, ST_AsText(accident_location)`,
              (err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: err,
                  });
                }
                const accident_id = result.rows[0].id;
                const acc_location = result.rows[0].st_astext;

                client.query(
                  `SELECT gid, name from trafficoffices WHERE ST_Within(ST_SetSRID(ST_GeomFromText('${acc_location}'), 4326), geom) and gid<36`,
                  (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error:
                          "Accident Location not in Mumbai Traffic Police Limits",
                      });
                    }
                    const station_id = result.rows[0].gid;
                    const station_name = result.rows[0].name;

                    client.query(
                      `UPDATE accidents SET station_id=${station_id} WHERE id=${accident_id}`,
                      (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error:
                              "Error in updating station_id in accidents db",
                          });
                        }
                        return res.json({
                          message: "Route Sent to Traffic Police Application",
                          ambulance_route_id: ambulance_route_id,
                          officers: officers,
                          accident_station: station_name,
                        });
                      }
                    );
                  }
                );
              }
            );
          } else {
            return res.json({
              message: "Route Sent to Traffic Police Application",
              ambulance_route_id: ambulance_route_id,
              officers: officers,
            });
          }
        }
      );
    }
  );
};

exports.costOfRoute = (req, res) => {
  const { ambulance_route } = req.body;
  client.query(
    `SELECT c.officer_id
  FROM( 
  SELECT a.officer_id, ST_AsGeoJSON(a.duty_location) as duty_location
        FROM (SELECT * FROM duties WHERE is_live=true and duty_type='Point') as a, (SELECT ST_Buffer(ST_GeomFromGeoJSON('{"type":"MultiLineString","coordinates":${ambulance_route}}'), 0.0005)) as b
        WHERE ST_Within(a.duty_location, b.st_buffer)) as c`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No officer found on duty",
        });
      }
      return res.json({ cost: result.rows.length });
    }
  );
};

//read

exports.getNotificationsByOfficerId = (req, res) => {
  client.query(
    `SELECT a.id, b.id as ambulance_route_id, ST_AsGeoJSON(b.ambulance_route) as ambulance_route, ST_AsGeoJSON(b.current_location) as current_location, b.route_type, cast(a.notification_time as text)
    FROM notifications as a
    LEFT JOIN ambulanceroutes as b
    ON a.ambulance_route_id = b.id
    WHERE a.officer_id = ${req.profileuser.id} AND b.isended = false`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Getting Ambulance Notifications for user",
        });
      }
      return res.json(result.rows);
    }
  );
};

exports.getNotification = (req, res) => {
  if (req.amnotification.officer_id !== req.profileuser.id) {
    return res.status(400).json({
      error: "This ambulance route does not cross your duty point",
    });
  }

  client.query(
    `SELECT a.id, a.duty_id, b.id as ambulance_route_id, ST_AsGeoJSON(b.ambulance_route) as ambulance_route, ST_AsGeoJSON(b.current_location) as current_location, ST_AsGeoJSON(b.start_location) as start_location, ST_AsGeoJSON(b.end_location) as end_location, b.route_type, cast(a.notification_time as text)
    FROM notifications as a
    LEFT JOIN ambulanceroutes as b
    ON a.ambulance_route_id = b.id
    WHERE a.officer_id = ${req.profileuser.id} AND a.id=${req.amnotification.id} AND b.isended = false`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Getting Ambulance Notifications for user",
        });
      }
      return res.json(result.rows[0]);
    }
  );
};

exports.getAccidentsByStationId = (req, res) => {
  client.query(
    `SELECT id, station_id, ambulance_route_id, ST_AsGeoJSON(accident_location) as accident_location, ST_AsGeoJSON(hospital_location) as hospital_location, cast(reported_time as text), isRead FROM accidents WHERE station_id = ${req.profile.gid} AND isread = false`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Getting Accidents For the Station",
        });
      }
      return res.json(result.rows);
    }
  );
};

exports.getAllAccidentsByStationId = (req, res) => {
  client.query(
    `SELECT ST_AsGeoJSON(accident_location) as accident_location FROM accidents`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No Accidents where fetched",
        });
      }
      const accident_array = [];
      result.rows.map((results, index) => {
        accident_array.push(JSON.parse(results.accident_location).coordinates);
      });
      return res.json(accident_array);
    }
  );
};

exports.getAccidentsByMY = (req, res) => {
  const { month, year } = req.body;
  client.query(
    `SELECT ST_AsGeoJSON(accident_location) as accident_location FROM accidents WHERE (SELECT EXTRACT(month FROM reported_time))=${month} AND (SELECT EXTRACT(year FROM reported_TIME))=${year}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in retrieving accidents from db for mY",
        });
      }
      const accident_array = [];
      result.rows.map((results, index) => {
        accident_array.push(JSON.parse(results.accident_location).coordinates);
      });
      return res.json(accident_array);
    }
  );
};

//update

exports.updateAmbulanceLocation = (req, res) => {
  const { ambulance_location } = req.body;
  client.query(
    `UPDATE ambulanceroutes SET current_location=ST_GeomFromGeoJSON('{"type":"Point","coordinates":${ambulance_location}}') WHERE id=${req.amroute.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in updating current location of ambulance",
        });
      }
      return res.json({
        message: "Ambulance Location Updated",
      });
    }
  );
};

exports.endRoute = (req, res) => {
  client.query(
    `UPDATE ambulanceroutes SET isended=true WHERE id=${req.amroute.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in updating status of ambulance route",
        });
      }
      return res.json({
        message: "Ambulance Route Ended",
      });
    }
  );
};

exports.readNotification = (req, res) => {
  client.query(
    `UPDATE notifications SET isnotificationread =true WHERE id=${req.amnotification.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Setting isreadnotification",
        });
      }
      return res.json({
        message: "Notification read",
      });
    }
  );
};

exports.readAccident = (req, res) => {
  if (req.profile.gid !== req.accident.station_id) {
    return res.status(400).json({
      error: "This accident does not belong to your station",
    });
  }
  client.query(
    `UPDATE accidents SET isread = true WHERE id=${req.accident.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Updating Read Accident Status",
        });
      }
      return res.json({
        message: "Notification Read",
      });
    }
  );
};
//delete

exports.deleteRoute = (req, res) => {
  client.query(
    `DELETE FROM notifications WHERE ambulance_route_id=${req.amroute.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Couldn't delete entries from Notifications DB",
        });
      }
      client.query(
        `DELETE FROM accidents WHERE ambulance_route_id=${req.amroute.id}`,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Couldn't delete entries from Accidents DB",
            });
          }
          client.query(
            `DELETE FROM ambulanceroutes WHERE id=${req.amroute.id}`,
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "Could not delete route",
                });
              }
              return res.json({
                message: "Route Deleted",
              });
            }
          );
        }
      );
    }
  );
};
