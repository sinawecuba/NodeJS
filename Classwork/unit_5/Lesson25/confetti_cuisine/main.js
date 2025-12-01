"use strict"; // Enables strict mode for cleaner, more secure JavaScript execution

// === Core Imports ===
const express = require("express"); // Imports Express framework
const layouts = require("express-ejs-layouts"); // Enables EJS layouts for templates
const methodOverride = require("method-override"); // Allows PUT and DELETE methods via query parameters

const cookieParser = require("cookie-parser"); // Parses cookies from client requests
const expressSession = require("express-session"); // Enables session management
const connectFlash = require("connect-flash"); // Allows temporary flash messages (e.g. success or error)
const mongoose = require("mongoose"); // Imports Mongoose for MongoDB connection and schema management

// === Controllers ===
const homeController = require("./controllers/homeController"); // Handles home page routes
const errorController = require("./controllers/errorController"); // Handles 404 and 500 error routes
const subscribersController = require("./controllers/subscribersController"); // Handles subscriber routes
const usersController = require("./controllers/usersController"); // Handles user-related routes
const coursesController = require("./controllers/coursesController"); // Handles course-related routes
const passport = require("passport"); // Used for authentication (login/logout)

// === Models ===
const User = require("./models/user"); // Imports the User model for authentication and database operations

// === App setup ===
const app = express(); // Creates an Express app
const router = express.Router(); // Creates an Express router to define routes separately

// === MongoDB Connection ===
mongoose
  .connect("mongodb://0.0.0.0:27017/confetti_cuisine") // Connects to local MongoDB database
  .then(() => console.log("✅ Connected to MongoDB successfully!")) // Logs success message
  .catch((err) => console.error("❌ MongoDB connection error:", err)); // Logs error if connection fails

// === Express App Configuration ===
app.set("port", process.env.PORT || 3000); // Sets the server port (defaults to 3000)
app.set("view engine", "ejs"); // Sets EJS as the view engine

// === Middleware ===
app.use(methodOverride("_method", { methods: ["POST", "GET"] })); // Enables PUT/DELETE via query parameter
app.use(layouts); // Enables EJS layout support
app.use(express.static("public")); // Serves static files (CSS, JS, images)
app.use(express.urlencoded({ extended: false })); // Parses form data (URL-encoded)
app.use(express.json()); // Parses incoming JSON requests

// === Sessions, Cookies & Flash ===
app.use(cookieParser("secretCuisine123")); // Parses cookies with a secret key
app.use(
  expressSession({
    secret: "secretCuisine123", // Secret key for signing the session ID cookie
    cookie: { maxAge: 4000000 }, // Session expiration time
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: false, // Prevents saving uninitialized sessions
  })
);
app.use(connectFlash()); // Enables flash messages for success/error feedback

// === Passport Authentication ===
app.use(passport.initialize()); // Initializes Passport for authentication
app.use(passport.session()); // Enables persistent login sessions
passport.use(User.createStrategy()); // Uses strategy provided by passport-local-mongoose
passport.serializeUser(User.serializeUser()); // Serializes user data into session
passport.deserializeUser(User.deserializeUser()); // Deserializes user data from session

// === Global Template Variables ===
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated(); // Boolean: true if user is logged in
  res.locals.currentUser = req.user; // Stores logged-in user's info for templates
  res.locals.flashMessages = req.flash(); // Passes flash messages to views
  next(); // Continue to next middleware
});

// === ROUTES ===

// Home & Static Pages
router.get("/", homeController.index); // Home page route
router.get("/contact", homeController.contact); // Contact page route

// Courses
router.get("/courses", coursesController.index, coursesController.indexView); // List all courses
router.get("/courses/new", coursesController.new); // Form to create a new course
router.post("/courses/create", coursesController.create, coursesController.redirectView); // Create a new course
router.get("/courses/:id/edit", coursesController.edit); // Form to edit an existing course
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView); // Update a course
router.get("/courses/:id", coursesController.show, coursesController.showView); // Show course details
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView); // Delete a course

// Users
router.get("/users", usersController.index, usersController.indexView); // List all users
router.get("/users/new", usersController.new); // Form to register a new user
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView); // Create user after validation
router.get("/users/login", usersController.login); // Login form
router.post("/users/login", usersController.authenticate); // Authenticate login
router.get("/users/logout", usersController.logout, usersController.redirectView); // Logout user
router.get("/users/:id/edit", usersController.edit); // Edit user form
router.put("/users/:id/update", usersController.update, usersController.redirectView); // Update user info
router.get("/users/:id", usersController.show, usersController.showView); // Show user profile
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView); // Delete a user

// Subscribers
router.get("/subscribers", subscribersController.index, subscribersController.indexView); // List all subscribers
router.get("/subscribers/new", subscribersController.new); // New subscriber form
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView); // Create subscriber
router.get("/subscribers/:id/edit", subscribersController.edit); // Edit subscriber form
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView); // Update subscriber info
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView); // Show subscriber details
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView); // Delete subscriber

// === Error Handling ===
router.use(errorController.pageNotFoundError); // 404 Page Not Found handler
router.use(errorController.internalServerError); // 500 Internal Server Error handler

// === Mount Router ===
app.use("/", router); // Mounts all routes under root URL

// === Start Server ===
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`); // Logs server start message
});
/**
 * ===============================================================
 * 🍽️ Confetti Cuisine Application — Main Server File
 * ===============================================================
 * 
 * This file is the **main entry point** for the Confetti Cuisine web application.
 * It sets up the Express server, connects to MongoDB via Mongoose, and registers
 * all middleware, authentication, routes, and error handlers.
 * 
 * ---------------------------------------------------------------
 * 🧩 Core Responsibilities:
 * ---------------------------------------------------------------
 * 1. **Server & Database Setup**
 *    - Initializes Express and connects to MongoDB (`confetti_cuisine`).
 *    - Configures EJS view engine and template layouts.
 * 
 * 2. **Middleware Configuration**
 *    - `method-override` → Enables PUT and DELETE in HTML forms.
 *    - `express.urlencoded` & `express.json` → Parses form and JSON data.
 *    - `cookie-parser`, `express-session`, `connect-flash` → Handles sessions and flash messages.
 * 
 * 3. **Authentication**
 *    - Configured with Passport.js using `passport-local-mongoose`.
 *    - Supports login, logout, and session persistence for authenticated users.
 * 
 * 4. **Routing**
 *    - Organized via MVC structure:
 *      - `/` & `/contact` → Handled by `homeController`.
 *      - `/users` → CRUD + authentication (register, login, update, delete).
 *      - `/courses` → Full CRUD operations for course management.
 *      - `/subscribers` → Newsletter subscription CRUD.
 * 
 * 5. **Error Handling**
 *    - `errorController.pageNotFoundError` → Handles 404 routes.
 *    - `errorController.internalServerError` → Handles 500-level errors.
 * 
 * 6. **Startup**
 *    - Server listens on port 3000 (or environment-defined port).
 *    - Logs successful MongoDB and server startup messages.
 * 
 * ---------------------------------------------------------------
 * 🧠 Architecture:
 * ---------------------------------------------------------------
 * - **Model-View-Controller (MVC)** structure promotes clean separation:
 *   - Models: Mongoose schemas (`User`, `Subscriber`, `Course`).
 *   - Views: EJS templates using `express-ejs-layouts`.
 *   - Controllers: Route logic for each entity.
 * 
 * ---------------------------------------------------------------
 * ✅ Author Notes:
 * ---------------------------------------------------------------
 * - Suitable for deployment or further expansion with APIs.
 * - Authentication-ready with Passport and flash messaging.
 * - Clean, modular, and beginner-friendly Express project structure.
 */
