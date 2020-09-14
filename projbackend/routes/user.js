const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { getAdminById } = require("../controllers/admin");
const {
  isAdminSignedIn,
  isAdminAuthenticated,
} = require("../controllers/adminAuth");
const {
  userRegistration,
  getUserById,
  deleteUser,
  getUser,
  getUserByStationId,
  updateUser,
} = require("../controllers/user");

router.param("adminId", getAdminById);
router.param("userId", getUserById); //Todo

//Create User

router.post(
  "/admin/:adminId/userRegistration",
  [
    check("name", "Should be minimum 3 Characters").isLength({ min: 3 }),
    check("phone", "Should be 10 Characters").isLength({ min: 10, max: 10 }),
    check("password", "Should be minimum 6 Characters").isLength({ min: 6 }),
  ],
  isAdminSignedIn,
  isAdminAuthenticated,
  userRegistration
);

//Read Users(traffic officials) by Station Id
router.get(
  "/admin/:adminId/user/:userId",
  isAdminSignedIn,
  isAdminAuthenticated,
  getUser
);
router.get(
  "/admin/:adminId/users",
  isAdminSignedIn,
  isAdminAuthenticated,
  getUserByStationId
);

//Update User
router.put(
  "/admin/:adminId/updateUser/:userId",
  [
    check("name", "Name should be minimum 3 Characters").isLength({ min: 3 }),
    check("phone", "Phone number should be 10 Characters").isLength({
      min: 10,
      max: 10,
    }),
  ],
  isAdminSignedIn,
  isAdminAuthenticated,
  updateUser
);

// Delete User

router.delete(
  "/admin/:adminId/deleteUser/:userId",
  isAdminSignedIn,
  isAdminAuthenticated,
  deleteUser
);

module.exports = router;
