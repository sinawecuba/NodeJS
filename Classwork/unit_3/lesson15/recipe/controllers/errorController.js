// === Import Required Modules ===
const httpStatus = require("http-status-codes"); // Provides easy-to-read HTTP status code constants
const path = require("path");                    // Helps resolve directory paths safely across OSes

// === Error Logging Middleware ===
// Logs the complete error stack trace to the console.
// Useful for debugging during development.
// After logging, it passes the error to the next middleware in the chain.
exports.logErrors = (error, req, res, next) => {
    console.error(error.stack); // Print detailed error info in the terminal
    next(error);                // Pass the error to the next error handler
};

// === 404 Error Handler (Page Not Found) ===
// This function runs when no route matches the incoming request.
// It sets the response status to 404 and sends a custom "404.html" page.
exports.respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.StatusCodes.NOT_FOUND; // Equivalent to HTTP status 404
    res.status(errorCode);
    // Send the "404.html" file stored in the "public" directory
    res.sendFile(path.join(__dirname, "../public/404.html"));
};

// === 500 Error Handler (Internal Server Error) ===
// This middleware handles unexpected server errors.
// It logs the error details and responds with a friendly message to the user.
exports.respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR; // Equivalent to HTTP status 500
    console.log(`ERROR occurred: ${error.stack}`);                // Log the stack trace for debugging
    res.status(errorCode);
    // Send a simple text message to the client
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
};
