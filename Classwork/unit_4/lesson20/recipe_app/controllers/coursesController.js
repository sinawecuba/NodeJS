"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT COURSE MODEL ===
const Course = require("../models/course"); // Mongoose model for the "courses" collection

// === EXPORT CONTROLLER FUNCTIONS ===
module.exports = {
  // Middleware to fetch all courses from the database
  index: (req, res, next) => {
    Course.find({}) // Query all documents in the courses collection
      .then(courses => {
        res.locals.courses = courses; // Store courses in res.locals to make them accessible in views
        next(); // Call next middleware/controller
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`); // Log any errors
        next(error); // Pass the error to the error-handling middleware
      });
  },

  // Render the index view for courses
  indexView: (req, res) => {
    res.render("courses/index"); // Render "courses/index.ejs" template
  }
};
