"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT MODULES ===
const express = require("express"),                     // Express framework
  app = express(),                                       // Create an Express app instance
  layouts = require("express-ejs-layouts"),             // Middleware for EJS layouts
  mongoose = require("mongoose"),                       // ODM for MongoDB
  errorController = require("./controllers/errorController"), // Error handling controller
  homeController = require("./controllers/homeController"),   // Home page controller
  subscribersController = require("./controllers/subscribersController"), // Subscribers controller
  usersController = require("./controllers/usersController"),         // Users controller
  coursesController = require("./controllers/coursesController"),     // Courses controller
  Subscriber = require("./models/subscriber");                   // Subscriber model

// === CONNECT TO MONGODB ===
mongoose.connect("mongodb://localhost:27017/recipe_db") // Connect to local MongoDB database
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

// Optional confirmation of connection
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// === EXPRESS APP SETUP ===
app.set("port", process.env.PORT || 3000); // Set port (default 3000)
app.set("view engine", "ejs");             // Set EJS as the view engine

// Middleware for static files, layouts, and parsing request bodies
app.use(express.static("public"));                 // Serve static files from "public" folder
app.use(layouts);                                  // Use express-ejs-layouts
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
app.use(express.json());                           // Parse JSON request bodies

// === CUSTOM MIDDLEWARE ===
app.use(homeController.logRequestPaths); // Log all incoming request paths

// === ROUTES ===
// Home page and contact page
app.get("/", homeController.index);                 // Home page
app.get("/contact", homeController.getSubscriptionPage); // Contact/subscription page

// User routes
app.get("/users", usersController.index, usersController.indexView); // List all users
app.get("/users/new", usersController.new);                          // Form for new user
app.post("/users/create", usersController.create, usersController.redirectView); // Create user
app.get("/users/:id", usersController.show, usersController.showView); // Show single user

// Subscriber and course routes
app.get("/subscribers", subscribersController.index, subscribersController.indexView); // List subscribers
app.get("/courses", coursesController.index, coursesController.indexView);               // List courses
app.post("/subscribe", subscribersController.saveSubscriber);                            // Add subscriber

// === ERROR HANDLERS ===
// Middleware for logging and responding to errors
app.use(errorController.logErrors);              // Log all errors
app.use(errorController.respondNoResourceFound); // Handle 404 errors
app.use(errorController.respondInternalError);  // Handle 500 errors

// === START SERVER ===
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
