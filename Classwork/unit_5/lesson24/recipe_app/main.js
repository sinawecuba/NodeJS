"use strict";

// ----------------------------
// ✅ MODULE IMPORTS
// ----------------------------
const express = require("express"); // Express framework
const app = express();
const router = express.Router();
const layouts = require("express-ejs-layouts"); // Layout support for EJS templates
const mongoose = require("mongoose"); // MongoDB ORM
const methodOverride = require("method-override"); // Allows PUT/DELETE via POST
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const Subscriber = require("./models/subscriber");

// 🔐 Authentication & session
const cookieParser = require("cookie-parser"); 
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");

// ✅ Form validation helpers
const { body, validationResult } = require("express-validator");

// ----------------------------
// ✅ MONGOOSE CONFIGURATION
// ----------------------------
mongoose.Promise = global.Promise; // Use native ES6 promises
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db"); // Connect to local MongoDB
const db = mongoose.connection;

db.once("open", () => {
  console.log("✅ Successfully connected to MongoDB using Mongoose!");
});

// ----------------------------
// ✅ EXPRESS APP CONFIGURATION
// ----------------------------
app.set("port", process.env.PORT || 3000); // Port configuration
app.set("view engine", "ejs"); // Set view engine to EJS

// Middleware setup
app.use(express.static("public")); // Serve static files from /public
app.use(layouts); // Use EJS layouts
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.json()); // Parse JSON
app.use(
  methodOverride("_method", { methods: ["POST", "GET"] }) // Override HTTP methods using query param
);

// ----------------------------
// ✅ COOKIE, SESSION & FLASH
// ----------------------------
app.use(cookieParser("secret_passcode")); // Parse cookies
app.use(
  expressSession({
    secret: "secret_passcode", // Session secret
    cookie: { maxAge: 4000000 }, // Session duration
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash()); // Flash messages for alerts and notifications

// ----------------------------
// ✅ PASSPORT INITIALIZATION
// ----------------------------
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Use session with Passport

// Configure Passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make authentication and flash info available to all views
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated(); // Boolean: is user logged in
  res.locals.currentUser = req.user;          // Current user info
  res.locals.flashMessages = req.flash();     // Flash messages
  next();
});

// ----------------------------
// ✅ ROUTES
// ----------------------------

// ----------------------------
// Home routes
// ----------------------------
router.use(homeController.logRequestPaths); // Log all request paths
router.get("/", homeController.index); // Home page
router.get("/contact", homeController.getSubscriptionPage); // Contact/subscription page

// ----------------------------
// User routes
// ----------------------------
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate, usersController.redirectView);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

// ----------------------------
// Subscriber routes
// ----------------------------
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.post("/subscribe", subscribersController.saveSubscriber); // Subscription form submission

// ----------------------------
// Course routes
// ----------------------------
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

// ----------------------------
// Recipe routes with validation
// ----------------------------
router.post(
  "/recipes",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("ingredients").notEmpty().withMessage("Ingredients are required"),
    body("instructions").notEmpty().withMessage("Instructions are required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // TODO: Implement recipe saving logic here
    res.send("✅ Recipe saved successfully!");
  }
);

// ----------------------------
// ✅ ERROR HANDLING
// ----------------------------
router.use(errorController.logErrors); // Log errors
router.use(errorController.respondNoResourceFound); // 404 handler
router.use(errorController.respondInternalError); // 500 handler

// ----------------------------
// ✅ START SERVER
// ----------------------------
app.use("/", router); // Mount router on root path

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
