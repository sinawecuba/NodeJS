"use strict"; 

// =======================================
// Import HTTP status codes library
// =======================================
const httpStatus = require("http-status-codes");

// =======================================
// Middleware to log errors to the console
// =======================================
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print full stack trace for debugging
  next(error); // Pass the error to the next error-handling middleware
};

// =======================================
// Respond when a requested resource is not found (404)
// =======================================
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404
  res.status(errorCode);                 // Set HTTP status
  res.send(`${errorCode} | The page does not exist!`); // Send response to client
};

// =======================================
// Respond when an internal server error occurs (500)
// =======================================
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
  console.log(`ERROR occurred: ${error.stack}`);    // Log full error stack for debugging
  res.status(errorCode);                            // Set HTTP status
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send response to client
};
