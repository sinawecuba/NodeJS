// Import the Express framework
const express = require("express");

// Create an Express application instance
const app = express();

// Serve static files from the "public" folder
// Example: CSS, JS, or images located in /public can be accessed directly
app.use(express.static("public"));

// Import controller modules
const homeController = require("./controllers/homeController"); // Handles main routes
const layouts = require("express-ejs-layouts"); // Adds layout support for EJS templates
const errorController = require("./controllers/errorController"); // Handles errors (404, 500, etc.)

// Register error-handling middleware
// These will catch and handle errors in your app
app.use(errorController.logErrors);            // Logs any errors to the console
app.use(errorController.respondNoResourceFound); // Handles 404 (page not found) errors
app.use(errorController.respondInternalError);   // Handles 500 (server) errors

// Set the server port (use environment variable if available, otherwise default to 3000)
app.set("port", process.env.PORT || 3000);

// Set EJS as the view engine (used for rendering dynamic HTML pages)
app.set("view engine", "ejs");

// Enable EJS layout support for consistent header/footer templates
app.use(layouts);

// Middleware to parse form submissions (URL-encoded data)
// `extended: false` means only simple key/value pairs (no nested objects)
app.use(
  express.urlencoded({
    extended: false
  })
);

// Middleware to parse JSON data in incoming requests (useful for APIs)
app.use(express.json());

// Custom middleware that logs each incoming request’s URL
// Helps with debugging and tracking app activity
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next(); // Pass control to the next middleware or route
});

// ====================
// ROUTE DEFINITIONS
// ====================

// Handle GET requests with a dynamic parameter "vegetable"
// Example: /items/carrot → displays "This is the page for carrot"
app.get("/items/:vegetable", homeController.sendReqParam);

// Handle POST requests to the home page (/)
// Logs request data and responds with a success message
app.post("/", homeController.sendPost);

// Handle GET requests with a dynamic name parameter
// Example: /name/James → renders index.ejs and passes "James" as firstName
app.get("/name/:myName", homeController.respondWithName);

// ====================
// START SERVER
// ====================

// Start the server and listen on the specified port
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
