"use strict"; // Enforce strict mode for safer JavaScript

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const express = require("express"); // Express framework
const app = express(); // Initialize Express app

//------------------------------------------------------
// ROUTER IMPORTS
//------------------------------------------------------
const router = require("./routes/index"); // Main router combining all route modules

// ----------------------------
// OTHER MODULE IMPORTS
// ----------------------------
const layouts = require("express-ejs-layouts"); // EJS layout templates
const mongoose = require("mongoose"); // MongoDB ODM
const methodOverride = require("method-override"); // Support PUT/DELETE in forms
const expressSession = require("express-session"); // Session middleware
const cookieParser = require("cookie-parser"); // Parse cookies
const connectFlash = require("connect-flash"); // Flash messages

const passport = require("passport"); // Authentication
const homeController = require("./controllers/homeController"); // Home page controller
const User = require("./models/user"); // User model
// Example in a route file:
const { body, validationResult } = require("express-validator");

router.post("/users", 
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Handle validation errors
      req.flash("error", "Invalid input");
      return res.redirect("back");
    }
    // Process valid data
  }
);
// ----------------------------
// DATABASE CONFIGURATION
// ----------------------------
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true }
);
// mongoose.set("useCreateIndex", true); <- REMOVE THIS LINE

const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});
// ----------------------------
// EXPRESS CONFIGURATION
// ----------------------------
app.set("port", process.env.PORT || 3000); // Set server port
app.set("view engine", "ejs"); // Use EJS for templating

// Serve static assets from public folder
app.use(express.static("public"));

// Enable EJS layouts
app.use(layouts);

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: false }));

// Allow PUT and DELETE methods in forms via query param _method
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Parse JSON request bodies
app.use(express.json());

// Configure cookies and session handling
app.use(cookieParser("secret_passcode"));
app.use(
  expressSession({
    secret: "secret_passcode", // Secret key for session
    cookie: { maxAge: 4000000 }, // Cookie expiry in milliseconds
    resave: false, // Only save session if modified
    saveUninitialized: false // Don't create session until something stored
  })
);

// ----------------------------
// PASSPORT AUTHENTICATION
// ----------------------------
app.use(passport.initialize());
app.use(passport.session()); // Persist login sessions
passport.use(User.createStrategy()); // Passport-local strategy via User model
passport.serializeUser(User.serializeUser()); // Store user ID in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user from session

// ----------------------------
// FLASH MESSAGES & LOCALS
// ----------------------------
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated(); // True if user logged in
  res.locals.currentUser = req.user; // Current user object
  res.locals.flashMessages = req.flash(); // Flash messages
  next();
});

// ----------------------------
// VALIDATION & LOGGING
// ----------------------------

app.use(homeController.logRequestPaths); // Log all incoming requests

//------------------------------------------------------
// ROUTING
//------------------------------------------------------
app.use("/", router); // Mount main router at root path

//------------------------------------------------------
// START SERVER
//------------------------------------------------------
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
