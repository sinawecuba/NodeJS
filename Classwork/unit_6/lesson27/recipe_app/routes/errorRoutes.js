"use strict"; // Enforce strict mode to catch errors

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const errorController = require("../controllers/errorController"); // Import error handling controller

// ----------------------------
// ERROR HANDLING MIDDLEWARE
// ----------------------------

// 1. logErrors -> Logs the stack trace of any error that occurs
router.use(errorController.logErrors);

// 2. respondNoResourceFound -> Handles 404 Not Found errors for unmatched routes
router.use(errorController.respondNoResourceFound);

// 3. respondInternalError -> Handles any 500 Internal Server Errors
router.use(errorController.respondInternalError);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
