const router = require("express").Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router.route("/register").get(users.getRegister).post(users.postRegister);

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.postLogin
  );

router.get("/logout", users.getLogout);

module.exports = router;
