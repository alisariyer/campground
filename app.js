const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const { campgroundValidationSchema, reviewValidationSchema } = require('./utils/validationSchema');
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

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

const validateCampground = (req, res, next) => {
  const { error } = campgroundValidationSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join("\n");
    throw new ExpressError(message, 400);
  } else {
    return next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(detail => detail.message).join(', ');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }

}

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "super") {
    return next();
  } else {
    // res.send('You cannot get this without password');
    // res.status(401);
    // throw new Error('Heyy password error');
    throw new ExpressError("Hey no no no", 401);
  }
};

// Setup routes
app.get("/", (req, res) => {
  res.render("home");
});

// Secret route
app.get("/secret", verifyPassword, (req, res) => {
  res.send("My secret is himmm. I cannot say...");
});

app.get("/error", (req, res) => {
  hello.call();
});

app.get("/admin", (req, res) => {
  throw new ExpressError("You are not admin!!!", 403);
});

// Campgrounds route
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// New Campground route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// New Campground post route
app.post(
  "/campgrounds",
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
    res.redirect(`/Campgrounds/${newCampground._id}`);
  })
);

// Specific campground route
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// Edit route
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// Edit route put
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete route
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const { body, rating } = req.body.review;
  const campground = await Campground.findById(req.params.id);
  const review = new Review({ body, rating });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  // const message = `
  // ***********************************************
  // *****************   ERROR   *******************
  // ***********************************************`
  // console.log(message);
  // next(err);
  // res.status(500).send('We got an error!');
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("campgrounds/error", { err });
});

// Run server
app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
