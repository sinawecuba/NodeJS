"use strict"; // Enforce strict mode for safer, cleaner JavaScript

// Import HTTP status codes (e.g., 404, 500)
const httpStatus = require("http-status-codes");

// Import the path module for handling file paths
const path = require("path");

/* ===============================
   Middleware for Logging Errors
   =============================== */
// Logs the error stack trace to the console
// Useful for debugging issues during development
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print detailed error info
  next(error); // Pass the error to the next middleware
};

/* ===============================
   404 - Resource Not Found Handler
   =============================== */
// Handles requests for routes that do not exist
exports.respondNoResourceFound = (req, res) => {
  // Define the HTTP 404 (Not Found) status code
  let errorCode = httpStatus.StatusCodes.NOT_FOUND;

  // Set the response status to 404
  res.status(errorCode);

  // Send a custom 404 HTML page to the client
  res.sendFile(path.join(__dirname, "../public/404.html"));
};

/* ===============================
   500 - Internal Server Error Handler
   =============================== */
// Handles unexpected server errors
exports.respondInternalError = (error, req, res, next) => {
  // Define the HTTP 500 (Internal Server Error) status code
  let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR;

  // Log the error details for debugging
  console.log(`ERROR occurred: ${error.stack}`);

  // Send a response to the client with an error message
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
