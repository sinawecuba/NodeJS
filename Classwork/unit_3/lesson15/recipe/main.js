"use strict"; // Enforces strict mode for cleaner, safer JavaScript

// === Module Imports ===
const express = require("express"),               // Web framework for building server applications
    layouts = require("express-ejs-layouts"),     // Middleware to manage EJS layout templates
    mongoose = require("mongoose"),               // MongoDB object data modeling (ODM) library
    app = express(),                              // Initialize Express app
    port = 3000,                                  // Define the port number for the server
    homeController = require("./controllers/homeController"),           // Controller for homepage and courses
    subscribersController = require("./controllers/subscribersController"), // Controller for managing subscribers
    errorController = require("./controllers/errorController");          // Controller for error handling

// === Database Connection ===
mongoose.connect("mongodb://127.0.0.1:27017/confetti_cuisine", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Set Mongoose to use native promises
mongoose.Promise = global.Promise;

// Confirm successful connection to MongoDB
mongoose.connection.once("open", () => {
    console.log("■ Connected to MongoDB successfully!");
});

// === View Engine Setup ===
app.set("view engine", "ejs"); // Use EJS as the templating engine
app.use(layouts);              // Enable EJS layouts
app.use(express.static("public")); // Serve static files (CSS, images, JS) from the “public” folder

// === Middleware Setup ===
app.use(express.urlencoded({ extended: false })); // Parse form data (URL-encoded)
app.use(express.json());                          // Parse JSON data sent in requests

// === ROUTES ===
// Home and courses pages
app.get("/", homeController.showHome);            // GET request for homepage
app.get("/courses", homeController.showCourses);  // GET request for courses page

// Contact and subscription routes
app.get("/contact", subscribersController.getSubscriptionPage); // Display subscription form
app.post("/subscribe", subscribersController.saveSubscriber);   // Save subscriber data to MongoDB

// Display all subscribers in the database
app.get("/subscribers", subscribersController.getAllSubscribers);

// === ERROR HANDLING ===
app.use(errorController.logErrors);               // Log all errors
app.use(errorController.respondNoResourceFound);  // Handle 404 Not Found errors
app.use(errorController.respondInternalError);    // Handle 500 Internal Server errors

// === Start Server ===
app.listen(port, () => {
    console.log(`■ Confetti Cuisine running on port ${port}`); // Confirm server is running
});
