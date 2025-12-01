"use strict"; // Enforce strict mode

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const router = require("express").Router(); // Create a top-level Express Router
const userRoutes = require("./userRoutes"); // Import user-related routes
const subscriberRoutes = require("./subscriberRoutes"); // Import subscriber-related routes
const courseRoutes = require("./courseRoutes"); // Import course-related routes
const errorRoutes = require("./errorRoutes"); // Import error-handling routes
const homeRoutes = require("./homeRoutes"); // Import home page routes
const apiRoutes = require("./apiRoutes"); // Import API routes (JSON responses)

// ----------------------------
// ROUTE NAMESPACING
// ----------------------------

// Mount userRoutes at /users
// Example: GET /users -> handled by userRoutes
router.use("/users", userRoutes);

// Mount subscriberRoutes at /subscribers
// Example: GET /subscribers -> handled by subscriberRoutes
router.use("/subscribers", subscriberRoutes);

// Mount courseRoutes at /courses
// Example: GET /courses -> handled by courseRoutes
router.use("/courses", courseRoutes);

// Mount apiRoutes at /api
// Example: GET /api/courses -> handled by API controllers returning JSON
router.use("/api", apiRoutes);

// Mount homeRoutes at / (root path)
// Example: GET / -> handled by homeRoutes
router.use("/", homeRoutes);

// Mount errorRoutes at / (root path) as last middleware
// Handles 404 and 500 errors for any unmatched routes
router.use("/", errorRoutes);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router; // Export router for use in main app (app.js)
