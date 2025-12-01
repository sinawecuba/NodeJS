// === Import Dependencies ===
const router = require("express").Router(); // Create a new Express Router instance

// === Import Sub-Routers ===
const apiRoutes = require("./apiRoutes");           // API routes (JSON endpoints)
const userRoutes = require("./userRoutes");         // User-related routes (CRUD, login/logout)
const subscriberRoutes = require("./subscriberRoutes"); // Subscriber-related routes
const courseRoutes = require("./courseRoutes");     // Course-related routes (CRUD, join)
const errorRoutes = require("./errorRoutes");       // Error-handling routes (404, 500)
const homeRoutes = require("./homeRoutes");         // Home page and contact routes

// === Mount Routers ===
// All requests starting with /users are handled by userRoutes
router.use("/users", userRoutes);

// All requests starting with /subscribers are handled by subscriberRoutes
router.use("/subscribers", subscriberRoutes);

// All requests starting with /courses are handled by courseRoutes
router.use("/courses", courseRoutes);

// All requests starting with / are handled by homeRoutes (e.g., homepage, contact page)
router.use("/", homeRoutes);

// Mount error-handling routes after all other routes
// This ensures 404 and 500 errors are handled last
router.use("/", errorRoutes);

// Mount API routes under /api
router.use("/api", apiRoutes);

// === Export Router ===
module.exports = router; // Export the main router to be used in app.js
