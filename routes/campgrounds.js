const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { campgroundValidationSchema } = require("../utils/validationSchema");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require('../isLoggedIn');

const validateCampground = (req, res, next) => {
  const { error } = campgroundValidationSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(message, 400);
  } else {
    return next();
  }
};

// Campgrounds route
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// New Campground route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// New Campground post route
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data!', 400);
    // const campgroundSchema = Joi.object({
    //   campground: Joi.object({
    //     title: Joi.string().required(),
    //     price: Joi.number().required().min(0),
    //   }).required(),
    // });
    // const { error } = campgroundSchema.validate(req.body);
    // if (error) {
    //     const message = error.details.map(el => el.message).join('\n');
    //     console.log(message);
    //   throw new ExpressError(message, 400);
    // }
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/Campgrounds/${newCampground._id}`);
  })
);

// Specific campground route
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  })
);
// Edit route
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// Edit route put
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
