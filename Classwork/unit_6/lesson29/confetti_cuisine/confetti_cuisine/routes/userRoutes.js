// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance
const usersController = require("../controllers/usersController"); // Import users controller

// === Route: GET / ===
// Fetch all users and render the index view
router.get(
  "/", 
  usersController.index,      // Middleware: fetch all users from DB
  usersController.indexView   // Middleware: render "users/index" template
);

// === Route: GET /new ===
// Render form to create a new user
router.get(
  "/new", 
  usersController.new         // Middleware: render "users/new" template
);

// === Route: POST /create ===
// Validate input, create a new user, and redirect
router.post(
  "/create", 
  usersController.validate,      // Middleware: validate form input
  usersController.create,        // Middleware: create new user in DB
  usersController.redirectView   // Middleware: redirect after creation
);

// === Route: GET /login ===
// Render login form
router.get(
  "/login", 
  usersController.login          // Middleware: render "users/login" template
);

// === Route: POST /login ===
// Authenticate user login
router.post(
  "/login", 
  usersController.authenticate   // Middleware: handle login using Passport
);

// === Route: GET /logout ===
// Logout user and redirect
router.get(
  "/logout", 
  usersController.logout,        // Middleware: logout current user
  usersController.redirectView   // Middleware: redirect after logout
);

// === Route: GET /:id/edit ===
// Render form to edit an existing user
router.get(
  "/:id/edit", 
  usersController.edit           // Middleware: fetch user by ID and render edit form
);

// === Route: PUT /:id/update ===
// Update an existing user and redirect
router.put(
  "/:id/update", 
  usersController.update,        // Middleware: update user in DB
  usersController.redirectView   // Middleware: redirect after update
);

// === Route: GET /:id ===
// Show details of a single user
router.get(
  "/:id", 
  usersController.show,          // Middleware: fetch user by ID
  usersController.showView       // Middleware: render "users/show" template
);

// === Route: DELETE /:id/delete ===
// Delete a user and redirect
router.delete(
  "/:id/delete", 
  usersController.delete,        // Middleware: remove user from DB
  usersController.redirectView   // Middleware: redirect after deletion
);

// === Export Router ===
module.exports = router; // Export router to be mounted in main app
