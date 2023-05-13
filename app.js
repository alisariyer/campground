const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const { reviewValidationSchema } = require('./utils/validationSchema');
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

const campgroundRoute = require('./routes/campground');

const main = async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
};

// Connect to the database
main()
  .then(() => console.log("Connected to the DB"))
  .catch((err) => console.log("Error: ", err));

// Setup view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Setup middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(detail => detail.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }

}

// Setup routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use('/campgrounds', campgroundRoute);

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const { body, rating } = req.body.review;
  const campground = await Campground.findById(req.params.id);
  const review = new Review({ body, rating });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("campgrounds/error", { err });
});

// Run server
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
