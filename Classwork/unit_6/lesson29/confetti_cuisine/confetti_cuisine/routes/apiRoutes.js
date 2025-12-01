// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const coursesController = require("../controllers/coursesController"); // Import the courses controller

// === Route: GET /courses ===
// Fetch all courses, filter based on user enrollment, and respond with JSON
router.get(
  "/courses",
  coursesController.index, // Middleware: fetch all courses from the database
  coursesController.filterUserCourses, // Middleware: mark which courses the current user has joined
  coursesController.respondJSON // Middleware: send the resulting courses as JSON response
);

// === Route: GET /courses/:id/join ===
// Allow current user to join a course, then respond with JSON
router.get(
  "/courses/:id/join",
  coursesController.join, // Middleware: enroll current user in the specified course
  coursesController.respondJSON // Middleware: respond with success status in JSON
);

// === Error-handling middleware ===
// Catch any errors from previous routes and respond with JSON
router.use(coursesController.errorJSON);

// === Export Router ===
module.exports = router; // Export the router to be used in the main app
