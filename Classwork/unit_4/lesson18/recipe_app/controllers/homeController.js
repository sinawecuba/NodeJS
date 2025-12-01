"use strict"; // Enforces strict mode to catch common coding mistakes and improve code reliability

// Export an object containing controller methods for handling basic routes and middleware
module.exports = {

  // === CONTROLLER METHOD: getSubscriptionPage ===
  // Purpose: Render the "contact" page where users can subscribe or get in touch
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Render the 'contact.ejs' (or .pug, etc.) view template
  },

  // === CONTROLLER METHOD: index ===
  // Purpose: Render the home page of the website
  index: (req, res) => {
    res.render("index"); // Render the 'index.ejs' view template
  },

  // === MIDDLEWARE: logRequestPaths ===
  // Purpose: Log every incoming request’s URL for debugging or analytics
  logRequestPaths: (req, res, next) => {
    console.log(`Request made to: ${req.url}`); // Print the requested URL to the console
    next(); // Continue to the next middleware or route handler
  }
};
