"use strict"; // Enforce strict mode

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const coursesController = require("../controllers/coursesController"); // Import controller methods

// ----------------------------
// ROUTES
// ----------------------------

// GET / - Show all courses in HTML view
// 1. coursesController.index -> Fetch all courses from DB
// 2. coursesController.indexView -> Render courses/index EJS view
router.get("/", coursesController.index, coursesController.indexView);

// GET /new - Render form to create a new course
router.get("/new", coursesController.new);

// POST /create - Create a new course
// 1. coursesController.create -> Save course to DB
// 2. coursesController.redirectView -> Redirect to appropriate page after creation
router.post("/create", coursesController.create, coursesController.redirectView);

// GET /:id/edit - Render form to edit an existing course
router.get("/:id/edit", coursesController.edit);

// PUT /:id/update - Update course information
// 1. coursesController.update -> Update course in DB
// 2. coursesController.redirectView -> Redirect to updated course page
router.put("/:id/update", coursesController.update, coursesController.redirectView);

// GET /:id - Show a single course details
// 1. coursesController.show -> Fetch course by ID from DB
// 2. coursesController.showView -> Render courses/show EJS view
router.get("/:id", coursesController.show, coursesController.showView);

// DELETE /:id/delete - Delete a course
// 1. coursesController.delete -> Remove course from DB
// 2. coursesController.redirectView -> Redirect to courses list after deletion
router.delete("/:id/delete", coursesController.delete, coursesController.redirectView);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
