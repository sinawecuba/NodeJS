"use strict"; // Enable strict mode to catch common JavaScript errors and enforce cleaner code practices

// Export an object containing route handler functions and middleware
module.exports = {
  /**
   * Controller method to render the subscription/contact page.
   * Triggered when a user visits the subscription or contact route.
   * Example: GET /contact
   */
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Renders the 'contact' view template
  },

  /**
   * Controller method to render the home page.
   * Triggered when a user visits the root route.
   * Example: GET /
   */
  index: (req, res) => {
    res.render("index"); // Renders the 'index' view template
  },

  /**
   * Middleware function to log every incoming request path.
   * Useful for debugging and tracking which routes are being accessed.
   * Calls `next()` to pass control to the next middleware or route handler.
   */
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`); // Log the requested URL to the console
    next(); // Proceed to the next middleware or route handler
  }
};
