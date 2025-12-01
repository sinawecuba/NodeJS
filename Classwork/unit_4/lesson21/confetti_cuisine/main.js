"use strict";

// === Import Dependencies ===
const express = require("express");                     // Express framework
const app = express();                                   // Initialize Express app
const errorController = require("./controllers/errorController"); // Error handling controller
const homeController = require("./controllers/homeController");   // Home page controller
const layouts = require("express-ejs-layouts");          // EJS layouts for templating
const mongoose = require("mongoose");                    // Mongoose for MongoDB
const Subscriber = require("./models/subscriber");       // Subscriber model
const subscriberController = require("./controllers/subscribersController"); // Subscriber controller

// === Connect to MongoDB ===
mongoose.connect("mongodb://0.0.0.0:27017/confetti_cuisine", { useNewUrlParser: true });

const db = mongoose.connection;

// Log success message once connection is open
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// === App Configuration ===
app.set("port", process.env.PORT || 3000);  // Set port (default 3000)
app.set("view engine", "ejs");              // Set EJS as the view engine

// === Middleware ===
app.use(express.static("public"));          // Serve static files from "public" folder
app.use(layouts);                           // Use EJS layouts
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded form data
app.use(express.json());                    // Parse JSON request bodies

// === Routes ===

// Home page route
app.get("/", homeController.index);         // Render index.ejs

// Courses page route
app.get("/courses", homeController.showCourses); // Render courses.ejs

// Form submission from contact page
app.post("/contact", homeController.postedSignUpForm); // Render thanks.ejs

// Subscribers page route
app.get("/subscribers", subscriberController.getAllSubscribers, (req, res, next) => {
    // Render subscribers.ejs with data from subscriberController
    res.render("subscribers", { subscribers: req.data });
});

// Subscription page route
app.get("/contact", subscriberController.getSubscriptionPage); // Render contact.ejs

// Save subscriber route
app.post("/subscribe", subscriberController.saveSubscriber);

// === Error Handling Middleware ===
app.use(errorController.respondNoResourceFound);  // 404 Not Found
app.use(errorController.respondInternalError);    // 500 Internal Server Error

// === Start Server ===
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
