const History = require('../models/historyModels');
const AppError = require('../utils/appError');
const CatchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.addHistory = factory.createOne(History);

exports.getUserId = CatchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  next();
});

exports.getUserHistory = CatchAsync(async (req, res, next) => {
  const userId = req.user.id; // Extract user ID from request object

  const histories = await History.find({ user: userId });

  if (!histories || histories.length === 0) {
    return next(new AppError('No history found for this user', 404));
  }

  req.history = histories;

  next();
});
