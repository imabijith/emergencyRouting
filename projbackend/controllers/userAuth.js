const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const client = require("../database");

exports.userSignout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout",
  });
};

exports.userSignin = (req, res) => {
  const { phone, password } = req.body;
  client.query(
    `SELECT * FROM trafficofficers WHERE phone='${phone}' and encry_password=crypt('${password}', encry_password)`,
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

      const user = {
        id: result.rows[0].id,
        uid: result.rows[0].uid,
        name: result.rows[0].name,
        phone: result.rows[0].phone,
        shift: result.rows[0].shift,
        username: result.rows[0].username,
        station: result.rows[0].station,
        onDuty: result.rows[0].onduty,
        onLeave: result.rows[0].onleave,
        duty_location: result.rows[0].duty_location,
      };
      const token = jwt.sign(
        { _id: result.rows[0].id },
        process.env.USERSECRET
      );

      res.cookie("token", token, { expire: new Date() + 9999 });

      res.json({
        token: token,
        user: user,
      });
    }
  );
};

exports.isUserSignedIn = expressJwt({
  secret: process.env.USERSECRET,
  userProperty: "authuser",
});

exports.isUserAuthenticated = (req, res, next) => {
  let checker =
    req.profileuser && req.authuser && req.profileuser.id === req.authuser._id;
  if (!checker) {
    return res.status(400).json({
      error: "User Access Denied",
    });
  }
  next();
};
