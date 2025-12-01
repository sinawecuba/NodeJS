"use strict";

// Import required modules
const express = require("express"); // Express framework for building web servers
const app = express(); // Create an Express application instance
const errorController = require("./controllers/errorController"); // Error handling middleware
const homeController = require("./controllers/homeController"); // Controller for route logic
const layouts = require("express-ejs-layouts"); // Middleware for EJS template layouts
const mongoose = require("mongoose"); // Mongoose library to interact with MongoDB
const Subscriber = require("./models/subscriber"); // Mongoose model for subscribers

// -------------------------------
// DATABASE CONNECTION
// -------------------------------
mongoose.connect("mongodb://127.0.0.1:27017/recipe_db") // Connect to local MongoDB database
  .then(() => console.log("✅ Successfully connected to MongoDB using Mongoose!"))
  .catch(error => console.error("❌ MongoDB connection error:", error));

// -------------------------------
// CREATE & QUERY DOCUMENTS
// -------------------------------
Subscriber.create({
  name: "James Oliveira",           // Name field
  email: "oliveira1james@gmail.com" // Email field
})
  .then(savedDoc => {
    console.log("✅ Document saved:", savedDoc); // Log the saved document
    return Subscriber.find({ name: "James Oliveira" }); // Query documents matching the name
  })
  .then(docs => {
    console.log("📄 Query results:", docs); // Log the results of the query
  })
  .catch(err => {
    console.error("⚠️ Error:", err); // Log any errors that occur
  });

// -------------------------------
// EXPRESS APP CONFIGURATION
// -------------------------------
app.set("port", process.env.PORT || 3000); // Set port to environment variable or 3000
app.set("view engine", "ejs"); // Set EJS as the view engine

// Middleware configuration
app.use(express.static("public")); // Serve static files from the "public" folder
app.use(layouts); // Enable EJS layouts
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
app.use(express.json()); // Parse JSON request bodies
app.use(homeController.logRequestPaths); // Log all incoming request URLs

// -------------------------------
// ROUTES
// -------------------------------
app.get("/name", homeController.respondWithName); // Render the index page
app.get("/items/:vegetable", homeController.sendReqParam); // Route with URL parameter

app.post("/", (req, res) => {
  console.log(req.body);  // Log the POST request body
  console.log(req.query); // Log any query parameters
  res.send("POST Successful!"); // Send confirmation response
});

// -------------------------------
// ERROR HANDLING
// -------------------------------
app.use(errorController.logErrors); // Log errors
app.use(errorController.respondNoResourceFound); // Handle 404 Not Found
app.use(errorController.respondInternalError); // Handle 500 Internal Server Error

// -------------------------------
// START SERVER
// -------------------------------
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
