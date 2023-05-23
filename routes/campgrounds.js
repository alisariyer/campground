const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router
  .route("/")
  // Campgrounds route
  .get(catchAsync(campgrounds.getIndex))
  // New Campground post route
  // upload.array(fieldName)
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.postIndex));

// New Campground route
router.get("/new", isLoggedIn, campgrounds.getNew);

router
  .route("/:id")
  // Specific campground route
  .get(isLoggedIn, catchAsync(campgrounds.getId))
  // Edit route put
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.putId))
  // Delete route
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteId));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.getIdEdit)
);

module.exports = router;
