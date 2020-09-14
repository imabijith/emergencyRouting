const express = require("express");
const router = express.Router();
const { getAdminById } = require("../controllers/admin");
const { getUserById } = require("../controllers/user");
const {
  getRouteById,
  getAccidentById,
  getNotificationById,
  createAmbulanceRoute,
  costOfRoute,
  getNotificationsByOfficerId,
  getNotification,
  getAccidentsByStationId,
  getAllAccidentsByStationId,
  getAccidentsByMY,
  updateAmbulanceLocation,
  endRoute,
  readNotification,
  readAccident,
  deleteRoute,
} = require("../controllers/ambulance");
const {
  isUserSignedIn,
  isUserAuthenticated,
} = require("../controllers/userAuth");
const {
  isAdminSignedIn,
  isAdminAuthenticated,
} = require("../controllers/adminAuth");

//params
router.param("routeId", getRouteById);
router.param("userId", getUserById);
router.param("adminId", getAdminById);
router.param("notificationId", getNotificationById);
router.param("accidentId", getAccidentById);

//create
router.post("/ambulanceroute/create", createAmbulanceRoute);
router.post("/ambulanceroute/cost", costOfRoute);

//read
router.get(
  "/user/:userId/getNotifications",
  isUserSignedIn,
  isUserAuthenticated,
  getNotificationsByOfficerId
);
router.get(
  "/user/:userId/getNotification/:notificationId",
  isUserSignedIn,
  isUserAuthenticated,
  getNotification
);
router.get(
  "/admin/:adminId/getAccidents",
  isAdminSignedIn,
  isAdminAuthenticated,
  getAccidentsByStationId
);
router.get(
  "/admin/:adminId/getAllAccidents",
  isAdminSignedIn,
  isAdminAuthenticated,
  getAllAccidentsByStationId
);
router.post(
  "/admin/:adminId/getAccidentsByMY",
  isAdminSignedIn,
  isAdminAuthenticated,
  getAccidentsByMY
);

//update
router.put(
  "/ambulanceroute/updateAmbulanceLocation/:routeId",
  updateAmbulanceLocation
);
router.put("/ambulanceroute/updateAmbulanceRoute/:routeId")
router.put("/ambulanceroute/end/:routeId", endRoute);
router.put(
  "/user/:userId/notifications/:notificationId/read",
  isUserSignedIn,
  isUserAuthenticated,
  readNotification
);
router.put(
  "/admin/:adminId/readAccident/:accidentId",
  isAdminSignedIn,
  isAdminAuthenticated,
  readAccident
);

//delete
router.delete("/ambulanceroute/deleteRoute/:routeId", deleteRoute);

module.exports = router;
