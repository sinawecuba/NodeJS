"use strict"; // Enforces strict mode to help catch errors and improve code reliability

const Course = require("../models/course"); // Import the Course model to interact with the "courses" collection

// Export an object containing controller methods for handling course-related requests
module.exports = {
  
  // Controller action to fetch all courses from the database
  index: (req, res, next) => {
    Course.find({}) // Retrieve all Course documents
      .then(courses => {
        // Store the fetched courses in res.locals
        // This makes them available to the next middleware or view
        res.locals.courses = courses;
        next(); // Proceed to the next middleware (e.g., indexView)
      })
      .catch(error => {
        // Handle any errors that occur during the database query
        console.log(`Error fetching courses: ${error.message}`);
        next(error); // Pass the error to the next middleware for centralized error handling
      });
  },

  // Controller action to render the "courses/index" view
  // This displays the list of courses stored in res.locals
  indexView: (req, res) => {
    res.render("courses/index"); // Render the courses index template
  }
};
