const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const {changePassword, signout, signin, isAdminSignedIn, isAdminAuthenticated} = require('../controllers/adminAuth');


router.post('/admin/signin', signin);

router.get('/admin/signout', signout); 

//TODO: add secure middleware after setting users
router.post('/admin/changePassword', [
    check('password', 'Password should be minimum 6 character').isLength({min: 3})],
    changePassword);


module.exports = router;