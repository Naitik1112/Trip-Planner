const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authContriller');

const router = express.Router();

router.get('/', authController.protect, viewController.getHome);

router.get('/login', viewController.getLoginForm);

router.get('/signup', viewController.getSignupForm);

router.get('/forgotPassword', viewController.getForgotPasswordForm);

router.get(
  '/changePassword',
  authController.protect,
  viewController.getChangePassword
);

router.get('/resetPassword/:token', viewController.getResetPasswordForm);

router.get('/me', authController.protect, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
