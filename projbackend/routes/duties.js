const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { getUserById } = require("../controllers/user");
const { getAdminById } = require("../controllers/admin");
const {
  isUserSignedIn,
  isUserAuthenticated,
} = require("../controllers/userAuth");
const {
  getDutyById,
  createDuty,
  getDuty,
  getDutyUser,
  getDutiesByStationId,
  getDutiesByOfficerId,
  getLiveDuty,
  getLiveDutyLocations,
  addLocation,
  updateDuty,
  startDuty,
  endDuty,
  deleteDuty,
} = require("../controllers/duties");
const {
  isAdminSignedIn,
  isAdminAuthenticated,
} = require("../controllers/adminAuth");

//params
router.param("dutyId", getDutyById);
router.param("userId", getUserById);
router.param("adminId", getAdminById);

//create

router.post(
  "/admin/:adminId/createDuty",
  [
    check(
      "duty_description",
      "Description Should be more than 25 words"
    ).isLength({ min: 25 }),
  ],
  isAdminSignedIn,
  isAdminAuthenticated,
  createDuty
);

//read(readbyofficerid, readbystationid(adminId), getDuty)

router.get(
  "/admin/:adminId/duty/:dutyId",
  isAdminSignedIn,
  isAdminAuthenticated,
  getDuty
);
router.get(
  "/user/:userId/duty/:dutyId",
  isUserSignedIn,
  isUserAuthenticated,
  getDutyUser
);

router.get(
  "/admin/:adminId/duties",
  isAdminSignedIn,
  isAdminAuthenticated,
  getDutiesByStationId
); //returns array
router.get(
  "/user/:userId/duties",
  isUserSignedIn,
  isUserAuthenticated,
  getDutiesByOfficerId
);
router.get(
  "/user/:userId/liveduties",
  isUserSignedIn,
  isUserAuthenticated,
  getLiveDuty
);
router.get(
  "/admin/:adminId/livedutylocations",
  isAdminSignedIn,
  isAdminAuthenticated,
  getLiveDutyLocations
);

//update(create/update location, update duty, update on_live, //TODO: update on_active from backend)

router.put(
  "/admin/:adminId/addLocation/:dutyId",
  isAdminSignedIn,
  isAdminAuthenticated,
  addLocation
);
router.put(
  "/admin/:adminId/updateDuty/:dutyId",
  [
    check(
      "duty_description",
      "Description Should be more than 25 words"
    ).isLength({ min: 25 }),
  ],
  isAdminSignedIn,
  isAdminAuthenticated,
  updateDuty
);
router.put(
  "/user/:userId/startDuty/:dutyId",
  isUserSignedIn,
  isUserAuthenticated,
  startDuty
); //User
router.put(
  "/user/:userId/endDuty/:dutyId",
  isUserSignedIn,
  isUserAuthenticated,
  endDuty
); //User

//delete

router.delete(
  "/admin/:adminId/deleteDuty/:dutyId",
  isAdminSignedIn,
  isAdminAuthenticated,
  deleteDuty
);
//export
module.exports = router;
