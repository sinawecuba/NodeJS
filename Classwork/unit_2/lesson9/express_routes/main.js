"use strict";

// Import required modules
const express = require("express"),   // Import Express.js framework
  app = express(),                     // Create an instance of an Express application
  port = 3000;                         // Define port number for the server

// Import controller for handling specific routes
const homeController = require("./controllers/homeController");

// Middleware to parse incoming request data
app.use(
  express.urlencoded({
    extended: false                    // Parse URL-encoded data (from forms)
  })
);
app.use(express.json());               // Parse JSON data in request bodies

// === ROUTES ===

// Test POST route for contact form submission
app.post("/contact", (req, res) => {
  res.send("Contact information submitted successfully."); // Respond with confirmation
});

// POST route to log request body and query parameters
app.post("/", (req, res) => {
  console.log("Request Body:", req.body);   // Log body of POST request
  console.log("Query Params:", req.query);  // Log query string parameters
  res.send("POST Successful!");             // Send response back to client
});

// Dynamic route example: uses URL parameter and controller function
app.get("/items/:vegetable", homeController.sendReqParam);

// Default home route
app.get("/", (req, res) => {
  res.send("Welcome to Express Routing!");  // Respond with a welcome message
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Log server URL when running
});
