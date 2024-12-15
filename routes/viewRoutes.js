const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authContriller');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  authController.protect,
  viewController.getTour
);

router.get('/login', viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
