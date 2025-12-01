"use strict";

const router = require("express").Router();
const userRoutes = require("./userRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const courseRoutes = require("./courseRoutes");
const errorRoutes = require("./errorRoutes");
const homeRoutes = require("./homeRoutes");
const apiRoutes = require("./apiRoutes");

//Tell local router object to use these routes with specific namespaces
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
