"use strict";

// Import HTTP status codes module for standardized responses
const httpStatus = require("http-status-codes");

// Middleware to log errors
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print the full error stack to the console for debugging
  next(error); // Pass the error to the next error-handling middleware
};

// Middleware to handle 404 (Not Found) errors
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404 status code
  res.status(errorCode); // Set the HTTP response status to 404
  res.send(`${errorCode} | The page does not exist!`); // Send a user-friendly message
};

// Middleware to handle 500 (Internal Server Error)
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500 status code
  console.log(`ERROR occurred: ${error.stack}`); // Log the error stack for debugging
  res.status(errorCode); // Set the HTTP response status to 500
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send a user-friendly message
};
