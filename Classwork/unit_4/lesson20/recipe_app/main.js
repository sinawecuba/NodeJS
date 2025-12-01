"use strict";

const express = require("express"),
  app = express(),                       // Initialize Express app
  layouts = require("express-ejs-layouts"), // Layout support for EJS
  mongoose = require("mongoose"),         // MongoDB ODM
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  Subscriber = require("./models/subscriber");

const methodOverride = require("method-override"); // Support for PUT & DELETE in forms

// === Connect to MongoDB ===
mongoose.connect("mongodb://localhost:27017/recipe_db")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

// Optional: confirm connection
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// === Express App Setup ===
app.set("port", process.env.PORT || 3000); // Port configuration
app.set("view engine", "ejs");            // Set EJS as the view engine

// Middleware for overriding HTTP methods (PUT, DELETE)
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Middleware to serve static files from the 'public' folder
app.use(express.static("public"));

// Middleware to enable layouts for EJS views
app.use(layouts);

// Middleware to parse form data and JSON payloads
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Log all request paths
app.use(homeController.logRequestPaths);

// === Routes ===

// Home routes
app.get("/", homeController.index);
app.get("/contact", homeController.getSubscriptionPage);

// User routes
app.get("/users", usersController.index, usersController.indexView); // List all users
app.get("/users/new", usersController.new);                           // Show form to create new user
app.post("/users/create", usersController.create, usersController.redirectView); // Create new user
app.get("/users/:id", usersController.show, usersController.showView);          // Show single user
app.get("/users/:id/edit", usersController.edit);                                // Edit user form
app.put("/users/:id/update", usersController.update, usersController.redirectView); // Update user
app.delete("/users/:id", usersController.delete, usersController.redirectView);     // Delete user

// Subscribers and courses routes
app.get("/subscribers", subscribersController.index, subscribersController.indexView);
app.get("/courses", coursesController.index, coursesController.indexView);
app.post("/subscribe", subscribersController.saveSubscriber); // Save new subscriber

// === Error Handlers ===
app.use(errorController.logErrors);               // Log errors
app.use(errorController.respondNoResourceFound); // Handle 404
app.use(errorController.respondInternalError);   // Handle 500

// === Start Server ===
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
