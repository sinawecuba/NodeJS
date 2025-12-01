"use strict"; // Enforce strict mode

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const coursesController = require("../controllers/coursesController"); // Import controller methods

// ----------------------------
// ROUTES
// ----------------------------

// GET /courses - Fetch all courses and respond in JSON format
// 1. coursesController.index -> Fetch all courses from DB
// 2. coursesController.filterUserCourses -> Add info if current user joined each course
// 3. coursesController.respondJSON -> Send JSON response with courses data
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);

// GET /courses/:id/join - Join a course API endpoint
// 1. coursesController.join -> Add course to current user's joined courses
// 2. coursesController.respondJSON -> Send JSON response indicating success/failure
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);

// ----------------------------
// API ERROR HANDLING
// ----------------------------
// Any errors thrown by previous routes will be handled here
router.use(coursesController.errorJSON); // Send JSON-formatted error response instead of HTML

// Export router to be used in main app
module.exports = router;
