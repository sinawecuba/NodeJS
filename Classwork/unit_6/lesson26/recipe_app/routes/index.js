"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  coursesRoutes = require("./coursesRoutes"),  // ← Changed from courseRoutes to coursesRoutes
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes");

router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", coursesRoutes);  // ← Now this matches the variable name above
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;