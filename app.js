const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session');
const ExpressError = require("./utils/ExpressError");

const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/review');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisisasimplesecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
    // 1000 ms > 60 seconds > 60 minutes > 24 hours > 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

// Setup routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);

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
