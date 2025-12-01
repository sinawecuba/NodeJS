"use strict"; // enable strict mode to help catch common JavaScript mistakes (e.g., using undeclared variables)

const Course = require("../models/course"); // import the Course model so we can query the database for course data

module.exports = { // export an object that holds all controller functions

  // === Home page ===
  index: (req, res) => { // define a function for handling requests to the homepage ("/")
    res.render("index"); // render the "index.ejs" template (your homepage view)
  }, // end index function

  // === Contact page ===
  contact: (req, res) => { // define a function for handling requests to the contact page ("/contact")
    res.render("contact"); // render the "contact.ejs" template (your contact view)
  }, // end contact function

  // === List courses on courses.ejs ===
  showCourses: (req, res, next) => { // define a function to fetch and show all courses from the database
    Course.find() // call Mongoose’s find() to retrieve all Course documents from MongoDB
      .then(courses => { // if successful, get an array of course objects
        res.render("courses/index", { courses }); // render "courses/index.ejs" and pass the list of courses as data
      }) // end .then
      .catch(error => { // handle any errors that occur while fetching data
        console.log(`Error fetching courses: ${error.message}`); // log the error to the console for debugging
        next(error); // pass the error to the next middleware (usually an error handler)
      }); // end .catch
  } // end showCourses function
}; // end module.exports object
