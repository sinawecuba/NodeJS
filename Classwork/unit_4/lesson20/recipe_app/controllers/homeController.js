"use strict"; // Enforce strict mode for safer and cleaner JavaScript

module.exports = {
  // Render the subscription/contact page
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Renders the "contact.ejs" template
  },

  // Render the home/index page
  index: (req, res) => {
    res.render("index"); // Renders the "index.ejs" template
  },

  // Middleware to log all incoming request paths
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`); // Logs the URL of the request
    next(); // Pass control to the next middleware/controller
  }
};
