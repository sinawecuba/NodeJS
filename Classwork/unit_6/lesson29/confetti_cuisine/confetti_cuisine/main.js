"use strict"; // Enforce strict mode for cleaner JS and better error checking

// === Core Imports ===
const express = require("express"); // Express framework for server and routing
const layouts = require("express-ejs-layouts"); // EJS layouts support
const methodOverride = require("method-override"); // Allows PUT/DELETE via query param
const cookieParser = require("cookie-parser"); // Parses cookies sent from clients
const expressSession = require("express-session"); // Session support for login
const connectFlash = require("connect-flash"); // Flash messages (success/error)
const mongoose = require("mongoose"); // MongoDB ORM

// === Controllers ===
const homeController = require("./controllers/homeController"); // Homepage & contact
const errorController = require("./controllers/errorController"); // 404 & 500 errors
const subscribersController = require("./controllers/subscribersController"); // Newsletter subscribers
const usersController = require("./controllers/usersController"); // Users (CRUD & auth)
const coursesController = require("./controllers/coursesController"); // Courses CRUD
const passport = require("passport"); // Authentication

// === Models ===
const User = require("./models/user"); // User model (for authentication)

// === App & Router Setup ===
const app = express(); // Create Express app
const router = express.Router(); // Router (can be used to modularize routes)

// === MongoDB Connection ===
mongoose
  .connect("mongodb://0.0.0.0:27017/confetti_cuisine") // Connect to local MongoDB
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Express App Configuration ===
app.set("port", process.env.PORT || 3000); // Default port 3000
app.set("view engine", "ejs"); // Use EJS templates

// === Middleware ===
app.use(methodOverride("_method", { methods: ["POST", "GET"] })); // Enable PUT/DELETE
app.use(layouts); // Enable EJS layout support
app.use(express.static("public")); // Serve static files
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
app.use(express.json()); // Parse JSON payloads

// === Sessions, Cookies & Flash ===
app.use(cookieParser("secretCuisine123")); // Parse cookies with secret key
app.use(
  expressSession({
    secret: "secretCuisine123", // Session secret
    cookie: { maxAge: 4000000 }, // Expiration
    resave: false, // Do not resave unchanged sessions
    saveUninitialized: false, // Do not save empty sessions
  })
);
app.use(connectFlash()); // Enable flash messages

// === Passport Authentication ===
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Enable persistent login sessions
passport.use(User.createStrategy()); // Passport-local-mongoose strategy
passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

// === Global Template Variables ===
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated(); // True if user logged in
  res.locals.currentUser = req.user; // Current logged-in user
  res.locals.flashMessages = req.flash(); // Flash messages
  next();
});

// === ROUTES ===
const userRoutes = require("./routes/userRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const courseRoutes = require("./routes/courseRoutes");
const homeRoutes = require("./routes/homeRoutes");
const errorRoutes = require("./routes/errorRoutes");
const apiRoutes = require("./routes/apiRoutes"); // API routes

// Mount routers
app.use("/", homeRoutes); // Homepage & contact
app.use("/users", userRoutes); // User CRUD & auth
app.use("/subscribers", subscriberRoutes); // Subscriber CRUD
app.use("/courses", courseRoutes); // Course CRUD
app.use("/api", apiRoutes); // API endpoints
app.use("/", errorRoutes); // Error handling (404/500)

// === Start Server ===
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});

/**
 * ===============================================================
 * 🍽️ Confetti Cuisine — Main Server File
 * ===============================================================
 * Responsibilities:
 * 1. Connects to MongoDB and logs success/error
 * 2. Sets up Express app, middleware, sessions, cookies, and flash
 * 3. Configures Passport authentication for login/logout
 * 4. Sets global template variables (loggedIn, currentUser, flash)
 * 5. Mounts all routes (home, users, subscribers, courses, api)
 * 6. Mounts error handling last
 * 7. Starts the server and listens on port 3000 (or env port)
 * 
 * Architecture: Follows MVC (Models, Views, Controllers) pattern
 */
