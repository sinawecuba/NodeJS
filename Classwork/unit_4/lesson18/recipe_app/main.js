"use strict"; // Enforce strict mode for better error checking and cleaner code

// === IMPORT MODULES ===
const express = require("express"),           // Express framework for building the web server
  app = express(),                            // Initialize the Express application
  layouts = require("express-ejs-layouts"),   // Layouts support for EJS templates
  mongoose = require("mongoose"),             // Mongoose for MongoDB object modeling
  errorController = require("./controllers/errorController"), // Handles errors
  homeController = require("./controllers/homeController"),   // Controls homepage & main routes
  subscribersController = require("./controllers/subscribersController"), // Handles subscribers logic
  usersController = require("./controllers/usersController"), // Handles user logic
  coursesController = require("./controllers/coursesController"), // Handles courses logic
  Subscriber = require("./models/subscriber"); // Import the Subscriber model (not directly used here but available if needed)


// === CONNECT TO MONGODB ===
// Connects to the MongoDB database "recipe_db" using Mongoose
mongoose.connect("mongodb://localhost:27017/recipe_db")
  .then(() => console.log("✅ Connected to MongoDB"))   // Logs success message
  .catch(err => console.error("❌ Connection error:", err)); // Logs connection errors

// === CONFIRM CONNECTION (OPTIONAL) ===
// Verifies the connection once it's open and logs confirmation
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});


// === EXPRESS APP CONFIGURATION ===
// Sets up core app settings and middleware

// Set port number — use environment variable if available, else default to 3000
app.set("port", process.env.PORT || 3000);

// Set the template engine to EJS (Embedded JavaScript)
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images) from the "public" folder
app.use(express.static("public"));

// Enable EJS layouts (for shared headers/footers)
app.use(layouts);

// Parse form data (URL-encoded data from POST requests)
app.use(express.urlencoded({ extended: false }));

// Parse JSON data (for API requests)
app.use(express.json());


// === MIDDLEWARE & CONTROLLERS ===

// Log every request path to the console (custom middleware from homeController)
app.use(homeController.logRequestPaths);

// === ROUTES (DEFINE PAGES & ACTIONS) ===

// Homepage
app.get("/", homeController.index);

// Contact / subscription page
app.get("/contact", homeController.getSubscriptionPage);

// Users list page
app.get("/users", usersController.index, usersController.indexView);

// Subscribers list page
app.get("/subscribers", subscribersController.index, subscribersController.indexView);

// Courses list page
app.get("/courses", coursesController.index, coursesController.indexView);

// Handle new subscriber form submission
app.post("/subscribe", subscribersController.saveSubscriber);


// === ERROR HANDLING MIDDLEWARE ===

// Log any errors that occur
app.use(errorController.logErrors);

// Handle "Page Not Found" (404) errors
app.use(errorController.respondNoResourceFound);

// Handle internal server errors (500)
app.use(errorController.respondInternalError);


// === START SERVER ===
// Launch the app and listen on the defined port
app.listen(app.get("port"), () => {
  console.log(`🚀 Server running at http://localhost:${app.get("port")}`);
});
