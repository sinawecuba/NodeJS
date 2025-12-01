"use strict"; // Enforce strict mode for safer JavaScript

// ========================
// Module Imports
// ========================
const express = require("express"); // Import Express framework
const app = express(); // Initialize Express app instance

//------------------------------------------------------
// Import routes
//------------------------------------------------------
const router = require("./routes/index"); // Main router for all app routes

//------------------------------------------------------
// Import other dependencies
//------------------------------------------------------
const layouts = require("express-ejs-layouts"); // EJS layouts middleware
const mongoose = require("mongoose"); // MongoDB ORM
const methodOverride = require("method-override"); // Allows PUT/DELETE in forms
const expressSession = require("express-session"); // Session middleware
const cookieParser = require("cookie-parser"); // Parse cookies
const connectFlash = require("connect-flash"); // Flash messages for alerts
// const expressValidator = require("express-validator"); // ❌ Deprecated, removed
const passport = require("passport"); // Authentication middleware
const homeController = require("./controllers/homeController"); // Home controller
const User = require("./models/user"); // User model for authentication

// ========================
// MongoDB Connection
// ========================
mongoose.Promise = global.Promise; // Use native ES6 promises

mongoose.connect(
"mongodb://0.0.0.0:27017/recipe_db", // MongoDB connection URL
{ useNewUrlParser: true } // Avoid deprecation warnings
);

const db = mongoose.connection;

// Event: Successfully connected to MongoDB
db.once("open", () => {
console.log("Successfully connected to MongoDB using Mongoose!");
});

// ========================
// Express App Settings
// ========================
app.set("port", process.env.PORT || 3000); // Set port
app.set("view engine", "ejs"); // Use EJS for templates
app.set("token", process.env.TOKEN || "recipeT0k3n"); // App token for any auth use

// ========================
// Middleware
// ========================
app.use(express.static("public")); // Serve static files from /public
app.use(layouts); // Use EJS layout support

app.use(
express.urlencoded({
extended: false // Parse URL-encoded bodies (for form submissions)
})
);

app.use(
methodOverride("_method", {
methods: ["POST", "GET"] // Override methods using query param _method
})
);

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser("secret_passcode")); // Parse cookies with secret

// Session configuration
app.use(
expressSession({
secret: "secret_passcode", // Secret for signing session ID cookie
cookie: { maxAge: 4000000 }, // Cookie expiration in milliseconds
resave: false, // Do not save session if unmodified
saveUninitialized: false // Do not create session until something stored
})
);

// ========================
// Passport.js (Authentication)
// ========================
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions

passport.use(User.createStrategy()); // Use User model's local strategy
passport.serializeUser(User.serializeUser()); // Serialize user into session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use(connectFlash()); // Enable flash messages for login/signup notifications

// ========================
// Custom Middleware
// ========================
app.use((req, res, next) => {
res.locals.loggedIn = req.isAuthenticated(); // Boolean: is user logged in
res.locals.currentUser = req.user; // Current logged-in user object
res.locals.flashMessages = req.flash(); // Flash messages for alerts
next(); // Pass control to next middleware
});

// Log each request path (custom logger from homeController)
app.use(homeController.logRequestPaths);

//========================
// Routes
//========================
app.use("/", router); // Use main router for all routes

// ========================
// Start Server
// ========================
app.listen(app.get("port"), () => {
console.log(`Server running at http://localhost:${app.get("port")}`);
});
