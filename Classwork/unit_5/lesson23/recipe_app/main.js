"use strict"; // Enable strict mode for safer JavaScript

// ----------------------------
// ✅ MODULE IMPORTS
// ----------------------------
const express = require("express"); // Import Express framework
const app = express(); // Initialize the Express app
const router = express.Router(); // Create a router for handling routes
const layouts = require("express-ejs-layouts"); // Middleware for EJS layouts
const mongoose = require("mongoose"); // MongoDB ODM
const methodOverride = require("method-override"); // Middleware to support PUT/DELETE via forms
const errorController = require("./controllers/errorController"); // Custom error handlers
const homeController = require("./controllers/homeController"); // Home page routes
const subscribersController = require("./controllers/subscribersController"); // Subscriber routes
const usersController = require("./controllers/usersController"); // User routes
const coursesController = require("./controllers/coursesController"); // Course routes
const Subscriber = require("./models/subscriber"); // Subscriber model

const expressSession = require("express-session"); // Session management
const cookieParser = require("cookie-parser"); // Cookie parsing middleware
const connectFlash = require("connect-flash"); // Flash messages middleware
const { body, validationResult } = require("express-validator"); // Request validation

// ----------------------------
// ✅ MONGOOSE CONFIGURATION
// ----------------------------
mongoose.Promise = global.Promise; // Use native promises
mongoose.connect("mongodb://0.0.0.0:27017/recipe_db"); // Connect to MongoDB
const db = mongoose.connection;

db.once("open", () => {
  console.log("✅ Successfully connected to MongoDB using Mongoose!");
});

// ----------------------------
// ✅ APP CONFIGURATION
// ----------------------------
app.set("port", process.env.PORT || 3000); // Set port from env or default 3000
app.set("view engine", "ejs"); // Set EJS as the view engine

// ----------------------------
// ✅ MIDDLEWARE SETUP
// ----------------------------
router.use(express.static("public")); // Serve static files from "public" directory
router.use(layouts); // Enable layout support for EJS templates
router.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
router.use(express.json()); // Parse JSON request bodies
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"], // Override HTTP methods via query parameter _method
  })
);

// ----------------------------
// ✅ COOKIE, SESSION & FLASH
// ----------------------------
router.use(cookieParser("secret_passcode")); // Parse cookies with secret
router.use(
  expressSession({
    secret: "secret_passcode", // Secret for signing session ID cookie
    cookie: { maxAge: 4000000 }, // Cookie expiration in milliseconds
    resave: false, // Do not resave unchanged sessions
    saveUninitialized: false, // Do not save uninitialized sessions
  })
);
router.use(connectFlash()); // Enable flash messages

// Middleware to make flash messages available to all views
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

// ----------------------------
// ✅ HOME ROUTES
// ----------------------------
router.use(homeController.logRequestPaths); // Log each request path
router.get("/", homeController.index); // Home page route
router.get("/contact", homeController.getSubscriptionPage); // Contact/subscription page

// ----------------------------
// ✅ USER ROUTES
// ----------------------------
router.get("/users", usersController.index, usersController.indexView); // List all users
router.get("/users/new", usersController.new); // New user form
router.get("/users/login", usersController.login); // Login form
router.post("/users/login", usersController.authenticate, usersController.redirectView); // Authenticate login
router.post("/users/create", usersController.create, usersController.redirectView); // Create new user
router.get("/users/:id/edit", usersController.edit); // Edit user form
router.put("/users/:id/update", usersController.update, usersController.redirectView); // Update user
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView); // Delete user
router.get("/users/:id", usersController.show, usersController.showView); // Show user details

// ----------------------------
// ✅ SUBSCRIBER ROUTES
// ----------------------------
router.get("/subscribers", subscribersController.index, subscribersController.indexView); // List subscribers
router.get("/subscribers/new", subscribersController.new); // New subscriber form
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView); // Create subscriber
router.get("/subscribers/:id/edit", subscribersController.edit); // Edit subscriber
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView); // Update subscriber
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView); // Delete subscriber
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView); // Show subscriber
router.post("/subscribe", subscribersController.saveSubscriber); // Handle subscription form

// ----------------------------
// ✅ COURSE ROUTES
// ----------------------------
router.get("/courses", coursesController.index, coursesController.indexView); // List courses
router.get("/courses/new", coursesController.new); // New course form
router.post("/courses/create", coursesController.create, coursesController.redirectView); // Create course
router.get("/courses/:id/edit", coursesController.edit); // Edit course
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView); // Update course
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView); // Delete course
router.get("/courses/:id", coursesController.show, coursesController.showView); // Show course

// ----------------------------
// ✅ RECIPE ROUTES WITH EXPRESS-VALIDATOR
// ----------------------------
router.post(
  "/recipes",
  [
    body("title").notEmpty().withMessage("Title is required"), // Validate title
    body("ingredients").notEmpty().withMessage("Ingredients are required"), // Validate ingredients
    body("instructions").notEmpty().withMessage("Instructions are required"), // Validate instructions
  ],
  (req, res) => {
    const errors = validationResult(req); // Check validation results
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }
    res.send("✅ Recipe saved successfully!"); // Placeholder response for successful save
  }
);

// ----------------------------
// ✅ ERROR HANDLING
// ----------------------------
router.use(errorController.logErrors); // Log errors
router.use(errorController.respondNoResourceFound); // Handle 404 errors
router.use(errorController.respondInternalError); // Handle 500 errors

// ----------------------------
// ✅ APP START
// ----------------------------
app.use("/", router); // Use the router for all routes

app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`); // Start the server
});
