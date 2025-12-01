"use strict"; // Enforces strict mode to catch common errors and enforce cleaner code

const httpStatus = require("http-status-codes"); // Import module for easy access to HTTP status code constants

// === MIDDLEWARE: logErrors ===
// Purpose: Logs details of any error that occurs during request processing
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print the error stack trace to the console for debugging
  next(error); // Pass the error to the next error-handling middleware
};

// === MIDDLEWARE: respondNoResourceFound ===
// Purpose: Handle requests for non-existent routes (404 Not Found)
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404 HTTP status code
  res.status(errorCode); // Set the response status to 404
  res.send(`${errorCode} | The page does not exist!`); // Send a simple error message to the client
};

// === MIDDLEWARE: respondInternalError ===
// Purpose: Handle unexpected server errors (500 Internal Server Error)
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500 HTTP status code
  console.log(`ERROR occurred: ${error.stack}`); // Log the error details to the console
  res.status(errorCode); // Set the response status to 500
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send an error message to the client
};
