"use strict";

const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.index);
// router.get("/contact", homeController.contact);
router.get("/contact", homeController.getSubscriptionPage);

module.exports = router;
