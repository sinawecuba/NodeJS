// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const errorController = require("../controllers/errorController"); // Import error-handling controller

// === Middleware: Handle 404 Not Found Errors ===
// This middleware is executed when no previous route matches the request
router.use(errorController.pageNotFoundError); 

// === Middleware: Handle 500 Internal Server Errors ===
// This middleware handles any server errors that occur in the app
router.use(errorController.internalServerError); 

// === Export Router ===
module.exports = router; // Export router to be used in main app
