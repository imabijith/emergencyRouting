const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const client = require("../database");

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Admin Signout",
  });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;
  client.query(
    `SELECT * FROM trafficoffices WHERE username='${username}' and encry_pass=crypt('${password}', encry_pass)`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      if (result.rows.length == 0) {
        return res.status(400).json({
          error: "Username and Password did not match",
        });
      }
      const admin = {
        gid: result.rows[0].gid,
        stationName: result.rows[0].name,
        regionName: result.rows[0].region,
        divisionName: result.rows[0].division,
        cityName: result.rows[0].name,
        type: result.rows[0].type,
        username: result.rows[0].username,
        geometry: result.rows[0].geom,
      };

      const token = jwt.sign({ _id: result.rows[0].gid }, process.env.SECRET);

      res.cookie("token", token, { expire: new Date() + 9999 });

      res.json({
        token: token,
        user: admin,
      });
    }
  );
};

exports.changePassword = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const { username, password, uniqueCode } = req.body;

  client.query(
    `UPDATE trafficoffices SET encry_pass = crypt('${password}', gen_salt('bf')) WHERE username='${username}' and salt='${uniqueCode}'`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      if (result.rowCount === 0) {
        return res.status(400).json({
          error: "Username and Unique Code doesn't match record",
        });
      }
      return res.json({ message: "Password Changed Succesfully" });
    }
  );
};

exports.isAdminSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.isAdminAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile.gid === req.auth._id;
  if (!checker) {
    return res.status(400).json({
      error: "Admin Access Denied",
    });
  }
  next();
};
