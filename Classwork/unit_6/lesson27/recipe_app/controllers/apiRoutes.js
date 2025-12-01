"use strict"; // Enforce strict mode to catch common errors and unsafe actions

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(), // Create a new Express router instance for defining routes
  coursesController = require("../controllers/coursesController"); // Import the coursesController module which contains route handler logic

// ----------------------------
// ROUTE DEFINITIONS
// ----------------------------

// Route: GET /courses/:id/join
// Description: Allows a user to join a specific course by ID.
// Middleware:
// 1. coursesController.join - Handles the logic for joining a course (e.g., adds user to course participants).
// 2. coursesController.respondJSON - Sends a JSON response to the client after join action.
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);

// Route: GET /courses
// Description: Retrieves all courses, optionally filtered for the logged-in user.
// Middleware chain:
// 1. coursesController.index - Fetches all courses from the database and stores them in res.locals.
// 2. coursesController.filterUserCourses - Filters the courses to only include those relevant to the current user.
// 3. coursesController.respondJSON - Sends the filtered course list as JSON to the client.
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);

// Error handling middleware
// Description: Catches errors from the previous route handlers and responds with JSON error messages.
router.use(coursesController.errorJSON);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
// Makes this router available to the main Express app
module.exports = router;
