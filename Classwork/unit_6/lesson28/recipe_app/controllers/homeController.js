"use strict";

// =======================================
// Home Controller
// Handles requests for static pages and logs requests
// =======================================
module.exports = {

  // =======================================
  // Render the subscription/contact page
  // Route example: GET /contact
  // =======================================
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Render the EJS template "contact.ejs"
  },

  // =======================================
  // Render the homepage
  // Route example: GET /
  // =======================================
  index: (req, res) => {
    res.render("index"); // Render the EJS template "index.ejs"
  },

  // =======================================
  // Middleware to log all incoming request paths
  // Can be used for debugging or request tracking
  // =======================================
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`); // Print requested URL to console
    next(); // Pass control to the next middleware
  }
};
