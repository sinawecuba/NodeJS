"use strict"; // Enforce strict mode to catch common mistakes

module.exports = {
  // ----------------------------
  // Render the subscription/contact page
  // ----------------------------
  getSubscriptionPage: (req, res) => {
    // Render 'contact.ejs' template
    res.render("contact");
  },

  // ----------------------------
  // Render the home/index page
  // ----------------------------
  index: (req, res) => {
    // Render 'index.ejs' template
    res.render("index");
  },

  // ----------------------------
  // Middleware to log all request paths
  // ----------------------------
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`); // Print the requested URL to the console
    next(); // Pass control to the next middleware or route handler
  }
};
