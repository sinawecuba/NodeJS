"use strict"; // Enforce strict mode

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const usersController = require("../controllers/usersController"); // Import users controller

// ----------------------------
// ROUTES
// ----------------------------

// GET /users - List all users
// 1. usersController.index -> Fetch all users from DB
// 2. usersController.indexView -> Render users/index EJS view
router.get("/", usersController.index, usersController.indexView);

// GET /users/new - Show form to create a new user
router.get("/new", usersController.new);

// POST /users/create - Create a new user
// 1. usersController.validate -> Validate input data before creation
// 2. usersController.create -> Save user to DB
// 3. usersController.redirectView -> Redirect after creation
router.post("/create", usersController.validate, usersController.create, usersController.redirectView);

// GET /users/login - Render login form
router.get("/login", usersController.login);

// POST /users/login - Authenticate user
// Uses Passport.js local strategy
router.post("/login", usersController.authenticate);

// GET /users/logout - Log out user
// 1. usersController.logout -> Terminate session
// 2. usersController.redirectView -> Redirect to home page after logout
router.get("/logout", usersController.logout, usersController.redirectView);

// GET /users/:id/edit - Show form to edit a user
router.get("/:id/edit", usersController.edit);

// PUT /users/:id/update - Update user information
// 1. usersController.update -> Update user in DB
// 2. usersController.redirectView -> Redirect after update
router.put("/:id/update", usersController.update, usersController.redirectView);

// GET /users/:id - Show a single user's details
// 1. usersController.show -> Fetch user by ID
// 2. usersController.showView -> Render users/show EJS view
router.get("/:id", usersController.show, usersController.showView);

// DELETE /users/:id/delete - Delete a user
// 1. usersController.delete -> Remove user from DB
// 2. usersController.redirectView -> Redirect to users list
router.delete("/:id/delete", usersController.delete, usersController.redirectView);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
