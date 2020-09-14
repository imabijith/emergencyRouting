const { check, validationResult } = require("express-validator");
const client = require("../database");

exports.getUserById = (req, res, next, id) => {
  client.query(
    `SELECT id, uid, station_id, name, phone, officer_rank, shift FROM trafficofficers WHERE id=${id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "User not found in DB",
        });
      }
      req.profileuser = result.rows[0];
      next();
    }
  );
};

//create

exports.userRegistration = (req, res) => {
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const { uid, name, phone, rank, shift, password } = req.body;
  const station_id = req.profile.gid;

  client.query(
    `INSERT INTO trafficofficers(uid,station_id,name,phone, officer_rank, shift, encry_password) VALUES('${uid}','${station_id}','${name}','${phone}', '${rank}', ${shift}, crypt('${password}', gen_salt('bf')) )`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "User not stored in db",
        });
      }
      return res.json({
        message: "User Registered",
        name: name,
        phone: phone,
      });
    }
  );
};

//read

exports.getUser = (req, res) => {
  if (req.profile.gid === req.profileuser.station_id) {
    return res.json(req.profileuser);
  } else {
    return res.status(400).json({
      error: "User does not belong to your station",
    });
  }
};

exports.getUserByStationId = (req, res) => {
  client.query(
    `SELECT * FROM trafficofficers WHERE station_id=${req.profile.gid}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "No User found in this Station from DB",
        });
      }
      return res.json(result.rows);
    }
  );
};

//update TODO:update password

exports.updateUser = (req, res) => {
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  if (req.profile.gid !== req.profileuser.station_id) {
    return res.status(400).json({
      error: "This officer does not belong to your station",
    });
  }

  const { uid, name, phone, rank, shift } = req.body;
  const station_id = req.profile.gid;
  client.query(
    `UPDATE trafficofficers SET uid='${uid}', station_id=${station_id}, name='${name}', phone='${phone}', officer_rank='${rank}', shift=${shift} WHERE id=${req.profileuser.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.json({
        message: "User Updated",
        name: name,
        phone: phone,
      });
    }
  );
};

//delete

exports.deleteUser = (req, res) => {
  if (req.profile.gid !== req.profileuser.station_id) {
    return res.status(400).json({
      error: "This officer does not belong to your station",
    });
  }

  client.query(
    `DELETE from notifications where officer_id=${req.profileuser.id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "User Notification not deleted",
        });
      }
      client.query(
        `DELETE from duties where officer_id=${req.profileuser.id}`,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: "User Notification not deleted",
            });
          }
          client.query(
            `DELETE FROM trafficofficers WHERE id=${req.profileuser.id}`,
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "User not deleted",
                  errors: err,
                });
              }

              res.json({
                message: "User Deleted",
              });
            }
          );
        }
      );
    }
  );
};
