const express = require('express');
const authController = require('./../controllers/authContriller');
const historyController = require('../controllers/historyController');

const router = express.Router();

router
  .route('/user')
  .get(authController.protect, historyController.getUserHistory)
  .post(
    authController.protect,
    historyController.getUserId,
    historyController.addHistory
  );

module.exports = router;
