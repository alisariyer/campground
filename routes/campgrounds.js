const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

// Campgrounds route
router.get("/", catchAsync(campgrounds.getIndex));

// New Campground route
router.get("/new", isLoggedIn, campgrounds.getNew);

// New Campground post route
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.postIndex)
);

// Specific campground route
router.get("/:id", isLoggedIn, catchAsync(campgrounds.getId));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.getIdEdit)
);

// Edit route put
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.putId)
);

// Delete route
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteId));

module.exports = router;
