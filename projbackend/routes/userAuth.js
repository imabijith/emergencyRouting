const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  userSignin,
  userSignout,
  isUserSignedIn,
  isUserAuthenticated,
} = require("../controllers/userAuth");

router.post("/user/signin", userSignin);

router.get("/user/signout", userSignout);

module.exports = router;
