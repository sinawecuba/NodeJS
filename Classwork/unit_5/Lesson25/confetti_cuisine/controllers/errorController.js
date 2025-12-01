"use strict"; // enforce strict mode to catch common mistakes like undeclared variables

const httpStatus = require("http-status-codes"); // import http-status-codes module for easy use of status constants

module.exports = { // export an object containing the error-handling methods

  // === 404 Page Not Found ===
  pageNotFoundError: (req, res) => { // middleware for handling requests to undefined routes
    const errorCode = httpStatus.NOT_FOUND; // set status code to 404 (Not Found)
    res.status(errorCode); // send 404 response status
    // Render a custom 404 page if you have a view file named "404.ejs" or similar
    res.render("404", { // render the 404 error view
      title: "Page Not Found", // set page title
      message: "Sorry, the page you are looking for does not exist." // message displayed to the user
    });
  }, // end of pageNotFoundError function

  // === 500 Internal Server Error ===
  internalServerError: (error, req, res, next) => { // middleware for handling unexpected server errors
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR; // set status code to 500 (Internal Server Error)
    
    // ❗ Fix template literal issue: should use backticks (`) instead of quotes
    console.log(`ERROR occurred: ${error.stack}`); // log full error stack trace for debugging
    
    res.status(errorCode); // send 500 response status
    
    // ❗ Also use backticks here to correctly display errorCode value
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`); // send a plain-text error message to the user
  } // end of internalServerError function
}; // end of exported module
