// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const homeController = require("../controllers/homeController"); // Import the home controller

// === Route: GET / ===
// Render the homepage
router.get(
  "/", 
  homeController.index // Middleware: render the homepage (usually "home/index" template)
);

// === Route: GET /contact ===
// Render the contact page
router.get(
  "/contact", 
  homeController.contact // Middleware: render the contact page (usually "home/contact" template)
);

// === Export Router ===
module.exports = router; // Export router to be mounted in main app
