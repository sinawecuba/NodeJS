// router.js
// A simple router module for handling GET and POST requests

const httpStatus = require("http-status-codes"); // Provides standard HTTP status codes
const contentTypes = require("./contentTypes");  // Module for content-type headers
const utils = require("./utils");                // Utility module, e.g., to read files

// Object to store route handlers for GET and POST methods
const routes = { "GET": {}, "POST": {} };

// Main request handler
exports.handle = (req, res) => {
  try {
    // Exact-match routing: call the handler function based on method and URL
    // Does not parse query strings or route parameters
    routes[req.method][req.url](req, res);
  } catch (e) {
    // If no matching route is found or an error occurs, serve a fallback error page
    res.writeHead(httpStatus.OK, contentTypes.html); // Set response headers
    utils.getFile("views/error.html", res);          // Send custom error page
  }
};

// Function to register a GET route
exports.get = (url, action) => {
  routes["GET"][url] = action; // Save the callback function for the given URL
};

// Function to register a POST route
exports.post = (url, action) => {
  routes["POST"][url] = action; // Save the callback function for the given URL
};
