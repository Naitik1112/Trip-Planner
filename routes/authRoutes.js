const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authContriller');

const router = express.Router();

// Google Signup (Default)
router.get(
  '/google',
  passport.authenticate('google-signup', {
    scope: ['profile', 'email']
  })
);

// Google Login (Only for existing users)
router.get(
  '/google/login',
  passport.authenticate('google-login', {
    scope: ['profile', 'email']
  })
);

// Google Signup Callback
router.get(
  '/google/callback',
  passport.authenticate('google-signup', { failureRedirect: '/login' }),
  authController.googleCallback
);

// Google Login Callback (Login Only)
router.get(
  '/google/login/callback',
  passport.authenticate('google-login', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  authController.googleCallback
);

module.exports = router;
