const express = require("express");
const router = express.Router({ mergeParams: true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewValidationSchema } = require('../utils/validationSchema');
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(detail => detail.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }

}

router.post('/', validateReview, catchAsync(async (req, res) => {
  const { body, rating } = req.body.review;
  const campground = await Campground.findById(req.params.id);
  const review = new Review({ body, rating });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created new review')
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted!');
  res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
