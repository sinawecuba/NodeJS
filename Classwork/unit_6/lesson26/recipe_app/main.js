"use strict";

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  passport = require("passport"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  User = require("./models/user");

// ✅ Modern express-validator import
const { body, validationResult } = require("express-validator");

// ---------------- Mongoose Connection ----------------
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("✅ Successfully connected to MongoDB using Mongoose!");
});

// ---------------- Express Config ----------------
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());

// ---------------- Global Middleware ----------------
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

// ❌ REMOVE this old line:
// app.use(expressValidator());

// ✅ express-validator is now used directly inside routes or controllers
// Example usage in a route:
/*
app.post(
  "/users",
  [
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").isLength({ min: 5 }).withMessage("Password too short.")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue with user creation logic...
  }
);
*/

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
