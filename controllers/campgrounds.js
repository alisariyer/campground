const Campground = require("../models/campground");

module.exports.getIndex = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.getNew = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postIndex = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
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
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  images = req.files.map(file => ({ url: file.path, filename: file.filename }))
  await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground, images },
    { new: true }
  );
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteId = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
