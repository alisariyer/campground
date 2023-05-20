const {
  campgroundValidationSchema,
  reviewValidationSchema,
} = require("./utils/validationSchema");
const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundValidationSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(message, 400);
  } else {
    return next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(302, `/campgrounds/${campground._id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};
