const Review = require('./../models/reviewModels');
const factory = require('./handlerFactory');
const Tour = require('./../models/tourModel');

exports.getAllReviews = factory.getAll(Review);

exports.setTourUserIds = async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug });
  if (!tour) {
    // If no tour is found, send a response or handle the error
    return res.status(404).send('Tour not found');
  }
  if (!req.body.tour) req.body.tour = tour._id;
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body);
  next();
};

exports.createReview = factory.createOne(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
