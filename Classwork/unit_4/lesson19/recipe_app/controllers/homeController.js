"use strict"; // Enforce strict mode for cleaner and safer JavaScript execution

// === EXPORT CONTROLLER FUNCTIONS ===
// This module defines functions that handle common routes and middleware
// for the home and contact pages of your application.

module.exports = {

  // === DISPLAY SUBSCRIPTION (CONTACT) PAGE ===
  // Handles GET requests to the "/contact" route.
  // Renders the "contact.ejs" view where users can subscribe or contact the site.
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Render the contact page template
  },

  // === DISPLAY HOME PAGE ===
  // Handles GET requests to the root route "/".
  // Renders the "index.ejs" view, typically the landing page of the website.
  index: (req, res) => {
    res.render("index"); // Render the home page template
  },

  // === LOG REQUEST PATHS (MIDDLEWARE) ===
  // Logs each incoming request URL to the console.
  // Useful for debugging or tracking requests made to your server.
  logRequestPaths: (req, res, next) => {
    console.log(`Request made to: ${req.url}`); // Log the URL path
    next(); // Pass control to the next middleware or route handler
  }
};
