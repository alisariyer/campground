const Campground = require("../models/campground");
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.getIndex = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.getNew = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postIndex = async (req, res, next) => {
  const response = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = response.body.features[0].geometry;
  campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/Campgrounds/${campground._id}`);
};

module.exports.getId = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    // Populate every reviews and for each review populate author
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    // Then populate author for campground
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.getIdEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.putId = async (req, res, next) => {
  const { id } = req.params;
  let campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  let images = req.files.map(file => ({ url: file.path, filename: file.filename }))
  images.push(...campground.images);
  campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground, images },
    { new: true }
  );
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      console.log('will be deleted: ', filename);
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteId = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
