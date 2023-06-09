if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");
const userRoute = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const mongoUrl =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/yelpcamp";

const main = async function () {
  await mongoose.connect(mongoUrl);
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
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

  const secret = process.env.SESSION_SECRET || "thisisasimplesecret";

const mongoStoreOptions = MongoStore.create({
  mongoUrl,
  crypto: {
    secret,
  },
  touchAfter: 24 * 60 * 60, // Regenerate after one day
});

const sessionConfig = {
  store: mongoStoreOptions,
  // override connect.sid name for more security
  name: "loc",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // Uncomment next line while production mode to force session only over https
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    // 1000 ms > 60 seconds > 60 minutes > 24 hours > 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());
// app.use(helmet({
//   contentSecurityPolicy: false
// }));

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/diswc9ddq/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "testuser@gmail.com", username: "testuser" });
  const newUser = await User.register(user, "lion");
  res.send(newUser);
});

// Setup routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", userRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);

app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("campgrounds/error", { err });
});

const PORT = process.env.PORT || 3000;
// Run server
app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
