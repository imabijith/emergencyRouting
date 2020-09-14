const express = require('express');
const router = express.Router();
const {getAdminById, getAdmin} = require('../controllers/admin')
const {isAdminSignedIn, isAdminAuthenticated} = require('../controllers/adminAuth');


router.param('adminId', getAdminById);

router.get('/admin/:adminId', isAdminSignedIn, isAdminAuthenticated ,getAdmin);

module.exports = router;