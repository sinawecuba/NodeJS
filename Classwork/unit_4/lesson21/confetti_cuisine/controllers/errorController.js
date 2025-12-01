"use strict";

const httpStatus = require("http-status-codes");

// === Middleware to log errors ===
// Logs the error stack to the console and passes the error to the next middleware
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print the full error stack trace
  next(error); // Pass the error to the next error-handling middleware
};

// === Middleware for handling 404 - Not Found errors ===
// Responds when a requested route does not exist
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // 404
  res.status(errorCode); // Set HTTP status
  res.send(`${errorCode} | The page does not exist!`); // Send response message
};

// === Middleware for handling 500 - Internal Server Errors ===
// Responds when the server encounters an unexpected error
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // 500
  console.log(`ERROR occurred: ${error.stack}`); // Log detailed error stack
  res.status(errorCode); // Set HTTP status
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // Send user-friendly message
};
