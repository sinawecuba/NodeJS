// router.js

// === Import Dependencies ===
const httpStatus = require("http-status-codes"); // Standard HTTP status codes
const contentTypes = require("./contentTypes");  // Custom content types for responses
const utils = require("./utils");                // Utility functions (like reading files)

// === Routes Object ===
// Stores the registered GET and POST routes as key-value pairs
// routes = { "GET": { "/": handler }, "POST": { "/submit": handler } }
const routes = { "GET": {}, "POST": {} };

// === Main Request Handler ===
// Called for every HTTP request to the server
exports.handle = (req, res) => {
  try {
    // Attempt to find and execute the route handler
    // Exact-match routing only: URL must match exactly (no query strings or dynamic params)
    routes[req.method][req.url](req, res);
  } catch (e) {
    // If route is not found or an error occurs, serve the error page
    res.writeHead(httpStatus.OK, contentTypes.html);
    utils.getFile("views/error.html", res);
  }
};

// === Register GET Route ===
// url: string (e.g., "/")
// action: function(req, res) -> the handler to execute
exports.get = (url, action) => {
  routes["GET"][url] = action;
};

// === Register POST Route ===
// url: string (e.g., "/submit")
// action: function(req, res) -> the handler to execute
exports.post = (url, action) => {
  routes["POST"][url] = action;
};
