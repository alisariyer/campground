const router = require("express").Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router.get("/register", users.getRegister);

router.post("/register", users.postRegister);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.postLogin
);

router.get("/logout", users.getLogout);

module.exports = router;
