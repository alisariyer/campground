const User = require("../models/user");

module.exports.getRegister = (req, res) => {
  res.render("users/register");
};

module.exports.postRegister = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect(302, "/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(302, "/register");
  }
};

module.exports.postLogin = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  // delete req.session.returnTo;
  res.redirect(302, redirectUrl);
};

module.exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", err.message);
      return next(err);
    }
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
  });
};
