"use strict"; // Enforce strict mode for safer and cleaner JavaScript

const httpStatus = require("http-status-codes"); // Import HTTP status codes

// === LOG ERRORS MIDDLEWARE ===
// Logs the error stack to the console and passes the error to the next middleware
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print full stack trace for debugging
  next(error);                // Pass the error to the next error-handling middleware
};

// === HANDLE 404 ERRORS ===
// Sends a "Not Found" response if no matching route was found
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404
  res.status(errorCode);                 // Set HTTP status
  res.send(`${errorCode} | The page does not exist!`); // Send response message
};

// === HANDLE 500 ERRORS ===
// Sends an "Internal Server Error" response for server-side errors
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
  console.log(`ERROR occurred: ${error.stack}`);     // Log the error stack
  res.status(errorCode);                             // Set HTTP status
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send response message
};
