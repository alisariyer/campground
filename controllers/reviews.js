const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.postIndex = async (req, res) => {
  const { body, rating } = req.body.review;
  const campground = await Campground.findById(req.params.id);
  const review = new Review({ body, rating });
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReviewId = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted!");
  res.redirect(`/campgrounds/${id}`);
};
