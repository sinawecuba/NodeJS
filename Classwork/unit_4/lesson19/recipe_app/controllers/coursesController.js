"use strict"; // Enforces strict mode for safer and cleaner JavaScript

// === IMPORT THE COURSE MODEL ===
// The Course model interacts with the "courses" collection in MongoDB.
const Course = require("../models/course");

// === EXPORT CONTROLLER METHODS ===
// These functions will be used by route handlers to manage course data and views.
module.exports = {

  // === INDEX ACTION (DATA FETCHING) ===
  // This middleware retrieves all course records from the database.
  index: (req, res, next) => {
    // Fetch all documents from the "courses" collection
    Course.find({})
      .then(courses => {
        // Store the retrieved courses in response locals
        // This makes them accessible to the next middleware or view
        res.locals.courses = courses;

        // Pass control to the next middleware (usually indexView)
        next();
      })
      .catch(error => {
        // Log any errors that occur during database retrieval
        console.log(`Error fetching courses: ${error.message}`);

        // Pass the error to Express's error handling middleware
        next(error);
      });
  },

  // === INDEX VIEW ACTION (RENDERING) ===
  // This function renders the "courses/index" view to display the course list.
  indexView: (req, res) => {
    // Renders the EJS template for displaying all courses.
    // The template can access data stored in res.locals.courses
    res.render("courses/index");
  }
};
