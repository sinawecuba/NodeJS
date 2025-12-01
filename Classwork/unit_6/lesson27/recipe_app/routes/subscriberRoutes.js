"use strict"; // Enforce strict mode to catch common mistakes

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const subscribersController = require("../controllers/subscribersController"); // Import subscribers controller

// ----------------------------
// ROUTES
// ----------------------------

// GET /subscribers - List all subscribers
// 1. subscribersController.index -> Fetch all subscribers from DB
// 2. subscribersController.indexView -> Render subscribers/index EJS view
router.get("/", subscribersController.index, subscribersController.indexView);

// GET /subscribers/new - Show form to create a new subscriber
router.get("/new", subscribersController.new);

// POST /subscribers/create - Create a new subscriber via admin interface
// 1. subscribersController.create -> Save subscriber to DB
// 2. subscribersController.redirectView -> Redirect after creation
router.post("/create", subscribersController.create, subscribersController.redirectView);

// POST /subscribers/subscribe - Handle public subscription form submission
// 1. subscribersController.saveSubscriber -> Save subscriber and render thanks page
router.post("/subscribe", subscribersController.saveSubscriber);

// GET /subscribers/:id/edit - Show form to edit an existing subscriber
router.get("/:id/edit", subscribersController.edit);

// PUT /subscribers/:id/update - Update subscriber information
// 1. subscribersController.update -> Update subscriber in DB
// 2. subscribersController.redirectView -> Redirect after update
router.put("/:id/update", subscribersController.update, subscribersController.redirectView);

// GET /subscribers/:id - Show a single subscriber's details
// 1. subscribersController.show -> Fetch subscriber by ID
// 2. subscribersController.showView -> Render subscribers/show EJS view
router.get("/:id", subscribersController.show, subscribersController.showView);

// DELETE /subscribers/:id/delete - Delete a subscriber
// 1. subscribersController.delete -> Remove subscriber from DB
// 2. subscribersController.redirectView -> Redirect to subscribers list
router.delete("/:id/delete", subscribersController.delete, subscribersController.redirectView);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
