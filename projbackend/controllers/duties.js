const client = require("../database");
const { check, validationResult } = require("express-validator");

exports.getDutyById = (req, res, next, id) => {
  client.query(
    `SELECT id, officer_id, station_id, duty_type, duty_description, cast(duty_date as varchar(50)), start_duty_time, end_duty_time, ST_AsGeoJson(duty_location) as duty_location, is_live, is_done, is_active FROM 
                    duties WHERE id=${id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: `${err}, Duty not found`,
        });
      }
      req.duty = result.rows[0];
      next();
    }
  );
};

//Create

exports.createDuty = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const {
    officer_id,
    duty_type,
    duty_description,
    duty_date,
    start_duty_time,
    end_duty_time,
  } = req.body;
  const station_id = req.profile.gid;

  client.query(
    `INSERT INTO duties(officer_id, station_id, duty_type, duty_description, duty_date, start_duty_time, end_duty_time) 
                  VALUES (${officer_id}, ${station_id}, '${duty_type}', '${duty_description}', '${duty_date}', '${start_duty_time}', '${end_duty_time}') RETURNING id`,
    (err, result) => {
      if (err) {
        return res.json({
          error: `Duty Creation Failed, ${err}`,
        });
      }
      return res.json({
        message: "Duty Created succesfully",
        id: result.rows[0].id,
      });
    }
  );
};

//Read

exports.getDuty = (req, res) => {
  if (req.profile.gid === req.duty.station_id) {
    return res.json(req.duty);
  } else {
    return res.status(400).json({
      error: "Duty does not belong to your station",
    });
  }
};

exports.getDutyUser = (req, res) => {
  if (req.profileuser.id === req.duty.officer_id) {
    return res.json(req.duty);
  } else {
    return res.status(400).json({
      error: "Duty does not belong to your station",
    });
  }
};

exports.getDutiesByStationId = (req, res) => {
  client.query(
    `SELECT duties.id, duties.officer_id, duties.station_id, duties.duty_type, duties.duty_description , cast(duty_date as varchar(50)) , duties.start_duty_time, duties.end_duty_time,  ST_AsGeoJson(duties.duty_location) as duty_location, duties.is_live, duties.is_done, duties.is_active, trafficofficers.name, trafficofficers.officer_rank FROM duties 
    LEFT JOIN trafficofficers ON duties.officer_id=trafficofficers.id WHERE duties.station_id=${req.profile.gid}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No Duties Found",
        });
      }
      return res.json(result.rows);
    }
  );
};

exports.getDutiesByOfficerId = (req, res) => {
  client.query(
    `SELECT duties.id, duties.officer_id, duties.station_id, duties.duty_type, duties.duty_description , cast(duty_date as varchar(50)) , duties.start_duty_time, duties.end_duty_time,  ST_AsGeoJson(duties.duty_location) as duty_location, duties.is_live, duties.is_done, duties.is_active FROM duties WHERE officer_id=${req.profileuser.id} and is_live=false and is_done=false `,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No Duties found for user",
        });
      }
      return res.json(result.rows);
    }
  );
};

exports.getLiveDuty = (req, res) => {
  client.query(
    `SELECT duties.id, duties.officer_id, duties.station_id, duties.duty_type, duties.duty_description , cast(duty_date as varchar(50)) , duties.start_duty_time, duties.end_duty_time,  ST_AsGeoJson(duties.duty_location) as duty_location, duties.is_live, duties.is_done, duties.is_active FROM duties WHERE officer_id=${req.profileuser.id} and is_live=true`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No Duties found for user",
        });
      }
      return res.json(result.rows[0]);
    }
  );
};

exports.getLiveDutyLocations = (req, res) => {
  client.query(
    `SELECT ST_AsGeoJSON(duty_location) FROM duties WHERE station_id=${req.profile.gid} and is_live=true`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Could not fetch live locations of duty from DB",
        });
      }
      return res.json(result.rows);
    }
  );
};
//Update

exports.addLocation = (req, res) => {
  const { point_lat, point_lng } = req.body;
  //example: {"type":"Point","coordinates":[125.6, 10.1]}

  client.query(
    `UPDATE duties SET duty_location=ST_GeomFromGeoJSON('{"type" : "Point", "coordinates": [${point_lng},${point_lat}]}') WHERE id=${req.duty.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        return res.json({
          message: "Location added succesfully",
        });
      }
    }
  );
};

exports.updateDuty = (req, res) => {
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  if (req.profile.gid != req.duty.station_id) {
    return res.status(400).json({
      error: "This officer does not belong to your station",
    });
  }

  const {
    duty_type,
    duty_description,
    duty_date,
    start_duty_time,
    end_duty_time,
  } = req.body;

  client.query(
    `UPDATE duties SET duty_type='${duty_type}', duty_description='${duty_description}', duty_date='${duty_date}', start_duty_time='${start_duty_time}', end_duty_time='${end_duty_time}'
                  WHERE id=${req.duty.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.json({
        message: "User Updated",
      });
    }
  );
};

//TODO: for user// need change start and end
exports.updateStatus = (req, res) => {
  const { status } = req.body;

  client.query(
    `UPDATE duties SET is_live=${status} WHERE id=${req.duty.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Status Not Updated",
        });
      }
      return res.json({
        message: `Duty status has been updated`,
      });
    }
  );
};

exports.startDuty = (req, res) => {
  client.query(
    `UPDATE duties SET is_live=true WHERE id=${req.duty.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Status Not Updated",
        });
      }
      return res.json({
        message: `Duty status has been updated to be live`,
      });
    }
  );
};

exports.endDuty = (req, res) => {
  client.query(
    `UPDATE duties SET is_live=false, is_done=true WHERE id=${req.duty.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Status Not Updated",
        });
      }
      return res.json({
        message: `Duty status has been updated to not live`,
      });
    }
  );
};

//delete

exports.deleteDuty = (req, res) => {
  if (req.profile.gid !== req.duty.station_id) {
    return res.status(400).json({
      error: "This duty doesn't belong to your station",
    });
  }

  client.query(`DELETE FROM duties WHERE id=${req.duty.id}`, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "User Deleted Successfully",
      });
    }
    return res.json({
      message: "User Deleted from DB",
    });
  });
};
