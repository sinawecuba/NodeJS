"use strict"; // Enforce strict mode for better coding practices and error prevention

// Import the HTTP status codes module for readable and consistent responses
const httpStatus = require("http-status-codes");

// === MIDDLEWARE 1: LOG ERRORS ===
// Logs the full error stack trace to the console for debugging purposes.
// This function does NOT send a response — it just passes the error along to the next handler.
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print the detailed error stack trace in the terminal
  next(error); // Pass the error to the next middleware in the chain
};

// === MIDDLEWARE 2: HANDLE "RESOURCE NOT FOUND" (404) ERRORS ===
// Triggered when no matching route or resource is found.
// Sends a 404 Not Found response to the client.
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404
  res.status(errorCode); // Set HTTP response status to 404
  res.send(`${errorCode} | The page does not exist!`); // Send an explanatory message
};

// === MIDDLEWARE 3: HANDLE INTERNAL SERVER ERRORS (500) ===
// Triggered when something goes wrong in the server-side logic or code.
// Logs the error and sends a 500 Internal Server Error response to the client.
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
  console.log(`ERROR occurred: ${error.stack}`); // Log the error stack trace for debugging
  res.status(errorCode); // Set HTTP response status to 500
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send a user-friendly error message
};
