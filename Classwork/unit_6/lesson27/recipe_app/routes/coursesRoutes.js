"use strict"; // Enforce strict mode to catch common errors

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(), // Create an Express Router instance
  coursesController = require("../controllers/coursesController"); // Import courses controller

// ----------------------------
// ROUTES
// ----------------------------

// GET / - Fetch all courses and render the index page
// 1. coursesController.index -> Retrieve all courses from database
// 2. coursesController.indexView -> Render courses/index EJS template
router.get("/", coursesController.index, coursesController.indexView);

// GET /new - Show form to create a new course
router.get("/new", coursesController.new);

// POST /create - Create a new course
// 1. coursesController.create -> Save new course to DB
// 2. coursesController.redirectView -> Redirect user after creation
router.post("/create", coursesController.create, coursesController.redirectView);

// GET /:id/edit - Show form to edit an existing course
router.get("/:id/edit", coursesController.edit);

// PUT /:id/update - Update a course
// 1. coursesController.update -> Update course in DB
// 2. coursesController.redirectView -> Redirect to the course page after update
router.put("/:id/update", coursesController.update, coursesController.redirectView);

// GET /:id - Show a single course details
// 1. coursesController.show -> Fetch course by ID
// 2. coursesController.showView -> Render courses/show EJS template
router.get("/:id", coursesController.show, coursesController.showView);

// DELETE /:id/delete - Delete a course
// 1. coursesController.delete -> Remove course from DB
// 2. coursesController.redirectView -> Redirect to course list after deletion
router.delete("/:id/delete", coursesController.delete, coursesController.redirectView);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
