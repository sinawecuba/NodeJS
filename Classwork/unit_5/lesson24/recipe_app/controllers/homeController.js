"use strict"; // Enable strict mode for safer JavaScript

module.exports = {
  /**
   * Render the subscription/contact page.
   * Typically used for showing a form where users can subscribe or contact.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  getSubscriptionPage: (req, res) => {
    res.render("contact"); // Render the 'contact.ejs' template
  },

  /**
   * Render the home/index page.
   * Typically used for the main landing page of the website.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  index: (req, res) => {
    res.render("index"); // Render the 'index.ejs' template
  },

  /**
   * Middleware to log the URL path of each incoming request.
   * Useful for debugging and tracking traffic.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Function} next - Pass control to the next middleware
   */
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`); // Log the requested URL
    next(); // Continue to next middleware or route handler
  }
};
