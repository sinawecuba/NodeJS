// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const coursesController = require("../controllers/coursesController"); // Import the courses controller

// === Route: GET / ===
// Fetch all courses and render the index view
router.get(
  "/", 
  coursesController.index,      // Middleware: fetch all courses from DB
  coursesController.indexView   // Middleware: render "courses/index" view
);

// === Route: GET /new ===
// Render form to create a new course
router.get(
  "/new", 
  coursesController.new         // Middleware: render "courses/new" template
);

// === Route: POST /create ===
// Create a new course and redirect
router.post(
  "/create", 
  coursesController.create,      // Middleware: create a new course in DB
  coursesController.redirectView // Middleware: redirect after creation
);

// === Route: GET /:id/edit ===
// Render edit form for an existing course
router.get(
  "/:id/edit", 
  coursesController.edit         // Middleware: fetch course by ID and render edit form
);

// === Route: PUT /:id/update ===
// Update an existing course and redirect
router.put(
  "/:id/update", 
  coursesController.update,      // Middleware: update course in DB
  coursesController.redirectView // Middleware: redirect after update
);

// === Route: GET /:id ===
// Show details of a single course
router.get(
  "/:id", 
  coursesController.show,        // Middleware: fetch course by ID
  coursesController.showView     // Middleware: render "courses/show" template
);

// === Route: DELETE /:id/delete ===
// Delete a course and redirect
router.delete(
  "/:id/delete", 
  coursesController.delete,      // Middleware: remove course from DB
  coursesController.redirectView // Middleware: redirect after deletion
);

// === Export Router ===
module.exports = router; // Export router to be mounted in main app
