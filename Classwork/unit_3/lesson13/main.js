// Import the Express framework
const express = require("express"); 
const app = express(); // Create an Express application instance

// Serve static files (CSS, JS, images) from the "public" folder
app.use(express.static("public"));

// Import controllers and middleware
const homeController = require("./controllers/homeController"); // Handles routes logic
const layouts = require("express-ejs-layouts"); // Middleware for EJS layouts
const errorController = require("./controllers/errorController"); // Handles errors

// Error handling middleware
app.use(errorController.logErrors); // Log all errors
app.use(errorController.respondNoResourceFound); // Handle 404 Not Found
app.use(errorController.respondInternalError); // Handle 500 Internal Server Error

// Set the port for the server
app.set("port", process.env.PORT || 3000); // Use environment port or default to 3000
app.set("view engine", "ejs"); // Set EJS as the templating engine

// Middleware to handle EJS layouts
app.use(layouts);

// Middleware to parse URL-encoded form data
app.use(
  express.urlencoded({
    extended: false // Use simple key-value parsing (no nested objects)
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`); // Log the requested URL
  next(); // Pass control to the next middleware/route
});

// Routes
app.get("/items/:vegetable", homeController.sendReqParam); // Route with URL parameter for vegetables
app.post("/", homeController.sendPost); // Handle POST requests to root URL
app.get("/name/:myName", homeController.respondWithName); // Route with URL parameter for names

// Start the server and listen on the configured port
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
