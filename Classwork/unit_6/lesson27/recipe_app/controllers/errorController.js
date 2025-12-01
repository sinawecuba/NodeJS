"use strict"; // Enforce strict mode to catch common mistakes

const httpStatus = require("http-status-codes"); // Standard HTTP status codes

// ----------------------------
// LOG ERRORS TO CONSOLE
// ----------------------------
exports.logErrors = (error, req, res, next) => {
  console.error(error.stack); // Print full error stack trace to console for debugging
  next(error); // Pass the error to the next middleware in the chain
};

// ----------------------------
// HANDLE 404 NOT FOUND
// ----------------------------
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND; // HTTP 404
  res.status(errorCode); // Set HTTP status code to 404
  // Send a simple error message to the client
  res.send(`${errorCode} | The page does not exist!`);
};

// ----------------------------
// HANDLE 500 INTERNAL SERVER ERRORS
// ----------------------------
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // HTTP 500
  console.log(`ERROR occurred: ${error.stack}`); // Log full error stack for debugging
  res.status(errorCode); // Set HTTP status code to 500
  // Send a generic error message to the client
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
