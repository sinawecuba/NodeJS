"use strict"; // Enforces strict mode to catch common coding mistakes and unsafe actions

// Import the HTTP status codes module for easy reference to standard status codes
const httpStatus = require("http-status-codes");

/**
 * Middleware for logging errors that occur during request processing.
 * This function logs the error stack trace to the console and then passes
 * the error to the next middleware in the chain.
 */
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Output the full error stack to the console
  next(error); // Pass the error to the next middleware for further handling
};

/**
 * Middleware to handle requests for resources that do not exist (404 errors).
 * It sends a "Not Found" message with the appropriate status code.
 */
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404 status code
  res.status(errorCode); // Set response status to 404
  res.send(`${errorCode} | The page does not exist!`); // Send error message to client
};

/**
 * Middleware to handle unexpected server errors (500 errors).
 * It logs the error details and sends a generic response to the client.
 */
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500 status code
  console.log(`ERROR occurred: ${error.stack}`); // Log detailed error info to console
  res.status(errorCode); // Set response status to 500
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send user-friendly error message
};
