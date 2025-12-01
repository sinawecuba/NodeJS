"use strict";

// Import required modules
const httpStatus = require("http-status-codes"); // Provides standard HTTP status codes
const path = require("path"); // Helps handle and transform file paths

// Middleware to log all errors to the console
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print the stack trace for debugging
  next(error); // Pass the error to the next middleware
};

// Middleware to handle 404 (Not Found) errors
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.StatusCodes.NOT_FOUND; // Set the HTTP status code for "Not Found"
  res.status(errorCode); // Send 404 status
  res.sendFile(path.join(__dirname, "../public/404.html")); // Serve the custom 404 error page
};

// Middleware to handle 500 (Internal Server Error)
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR; // Set the HTTP status code for server errors
  console.log(`ERROR occurred: ${error.stack}`); // Log the full error stack trace
  res.status(errorCode); // Send 500 status
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send a user-friendly message
};
