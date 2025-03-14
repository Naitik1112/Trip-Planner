const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authContriller');

const router = express.Router();

router.get('/', authController.protect, viewController.getAccount);

router.get('/login', viewController.getLoginForm);

router.get('/signup', viewController.getSignupForm);

router.get('/forgotPassword', viewController.getForgotPasswordForm);

router.get('/resetPassword/:token', viewController.getResetPasswordForm);

router.get('/me', authController.protect, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
