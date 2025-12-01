// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const subscribersController = require("../controllers/subscribersController"); // Import subscribers controller

// === Route: GET / ===
// Fetch all subscribers and render the index view
router.get(
  "/", 
  subscribersController.index,      // Middleware: fetch all subscribers from DB
  subscribersController.indexView   // Middleware: render "subscribers/index" template
);

// === Route: GET /new ===
// Render form to create a new subscriber
router.get(
  "/new", 
  subscribersController.new         // Middleware: render "subscribers/new" template
);

// === Route: POST /create ===
// Create a new subscriber and redirect
router.post(
  "/create", 
  subscribersController.create,      // Middleware: save new subscriber to DB
  subscribersController.redirectView // Middleware: redirect after creation
);

// === Route: GET /:id/edit ===
// Render form to edit an existing subscriber
router.get(
  "/:id/edit", 
  subscribersController.edit         // Middleware: fetch subscriber by ID and render edit form
);

// === Route: PUT /:id/update ===
// Update an existing subscriber and redirect
router.put(
  "/:id/update", 
  subscribersController.update,      // Middleware: update subscriber in DB
  subscribersController.redirectView // Middleware: redirect after update
);

// === Route: GET /:id ===
// Show details of a single subscriber
router.get(
  "/:id", 
  subscribersController.show,        // Middleware: fetch subscriber by ID
  subscribersController.showView     // Middleware: render "subscribers/show" template
);

// === Route: DELETE /:id/delete ===
// Delete a subscriber and redirect
router.delete(
  "/:id/delete", 
  subscribersController.delete,      // Middleware: remove subscriber from DB
  subscribersController.redirectView // Middleware: redirect after deletion
);

// === Export Router ===
module.exports = router; // Export router to be mounted in main app
