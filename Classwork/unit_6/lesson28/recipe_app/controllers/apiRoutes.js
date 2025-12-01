"use strict"; // Enforce strict mode for safer JavaScript

// =======================================
// Import dependencies and controllers
// =======================================
const router = require("express").Router(),       // Create a new Express router
  usersController = require("../controllers/usersController"),   // Handles user-related logic
  coursesController = require("../controllers/coursesController"); // Handles course-related logic

// =======================================
// Routes for API endpoints
// =======================================

// POST /login → Authenticate a user via API
router.post("/login", usersController.apiAuthenticate);

// GET /courses/:id/join → Let a user join a course and respond in JSON
// Middleware sequence: join the course → respond with JSON
router.get("/courses/:id/join", 
  coursesController.join, 
  coursesController.respondJSON
);

// GET /courses → Return a list of courses as JSON
// Middleware sequence: fetch all courses → filter based on user → respond with JSON
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);

// =======================================
// Error handling for this router
// =======================================
// If any middleware above throws an error, respond with JSON error
router.use(coursesController.errorJSON);

// =======================================
// Export the router to be mounted in main server file
// =======================================
module.exports = router;
