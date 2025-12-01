"use strict";

// Middleware to log the URL path of every incoming request
exports.logRequestPaths = (req, res, next) => {
  console.log(`Request made to: ${req.url}`); // Print the requested URL to the console
  next(); // Pass control to the next middleware or route
};

// Route handler to respond with a URL parameter
exports.sendReqParam = (req, res) => {
  let veg = req.params.vegetable; // Extract the 'vegetable' parameter from the URL
  res.send(`This is the page for ${veg}`); // Send a response including the vegetable name
};

// Route handler to render a template
exports.respondWithName = (req, res) => {
  res.render("index"); // Render the 'index' view (EJS template)
};
