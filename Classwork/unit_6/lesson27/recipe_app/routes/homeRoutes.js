"use strict"; // Enforce strict mode to catch common mistakes

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create an Express Router instance
const homeController = require("../controllers/homeController"); // Import home controller

// ----------------------------
// ROUTES
// ----------------------------

// GET / - Render the home page
// Calls homeController.index to render index view
router.get("/", homeController.index);

// GET /contact - Render the contact/subscription page
// Calls homeController.getSubscriptionPage to render the subscription form
// The commented line shows an alternative route (homeController.contact) if needed
router.get("/contact", homeController.getSubscriptionPage);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router to be used in main app
