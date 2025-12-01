"use strict";

// Array of course objects offered by the application
let courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];

// === Controller to render all courses ===
// Renders the "courses" view and passes the courses array as "offeredCourses"
exports.showCourses = (req, res) => {
  res.render("courses", {
    offeredCourses: courses
  });
};

// === Controller to render the home page ===
// Renders the "index" view
exports.index = (req, res) => {
  res.render("index");
};

// === Controller to show the sign-up/contact page ===
// Renders the "contact" view
exports.showSignUp = (req, res) => {
  res.render("contact");
};

// === Controller to handle posted sign-up form ===
// Renders a "thanks" page after form submission
exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};

/*
Optional / commented out controllers:

// Log every request URL
// exports.logRequestPaths = (req, res, next) => {
//   console.log(`request made to: ${req.url}`);
//   next();
// };

// Respond with the vegetable parameter in URL
// exports.sendReqParam = (req, res) => {
//   let veg = req.params.vegetable;
//   res.send(`This is the page for ${veg}`);
// };

// Respond with name (example placeholder)
// exports.respondWithName = (req, res) => {
//   res.render("index");
// };
*/
