const express = require('express');
const router = express.Router();
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware.js');
const usercontroller = require('../controllers/user');

router
  .route('/signup')
  .get(usercontroller.rendersignup)
  .post(wrapAsync(usercontroller.signup));
router
  .route('/login')
  .get(usercontroller.renderlogin)
  .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usercontroller.login);
router
  .route('/logout')
  .get(usercontroller.logout);

module.exports = router;