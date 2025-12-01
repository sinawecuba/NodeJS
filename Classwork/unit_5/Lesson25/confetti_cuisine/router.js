// router.js

const httpStatus = require("http-status-codes"); // Imports HTTP status code constants
const contentTypes = require("./contentTypes"); // Imports predefined content type mappings
const utils = require("./utils"); // Imports utility functions (e.g., for serving files)

// Define an object to store routes for GET and POST requests
const routes = { "GET": {}, "POST": {} };

// === Main Request Handler ===
exports.handle = (req, res) => {
  try {
    // Attempt to execute the route handler based on request method and URL
    // Only supports exact URL matching (no query string or dynamic parameters)
    routes[req.method][req.url](req, res);
  } catch (e) {
    // If route is not found or any error occurs, serve a fallback error page
    res.writeHead(httpStatus.OK, contentTypes.html); // Set response header to HTML type
    utils.getFile("views/error.html", res); // Load and serve the error page
  }
};

// === Register a GET Route ===
// Associates a URL with a function for GET requests
exports.get = (url, action) => {
  routes["GET"][url] = action;
};

// === Register a POST Route ===
// Associates a URL with a function for POST requests
exports.post = (url, action) => {
  routes["POST"][url] = action;
};
