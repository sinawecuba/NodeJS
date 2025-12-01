"use strict"; // Enforce strict mode for cleaner and safer JavaScript

// === Import Course Model ===
const Course = require("../models/course"); // Import the Course schema to interact with the database

// === Export Course Controller Methods ===
module.exports = {

  // === List All Courses ===
  index: (req, res, next) => {
    // Fetch all courses from the database
    Course.find({})
      .then(courses => {
        // Store the retrieved courses in res.locals for later use in views
        res.locals.courses = courses;
        next(); // Move to the next middleware (indexView)
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error); // Pass error to the next middleware
      });
  },

  // === Render Course Index Page ===
  indexView: (req, res) => {
    // Renders the "courses/index" EJS view with course data
    res.render("courses/index");
  },

  // === Render New Course Form ===
  new: (req, res) => {
    // Displays a form to create a new course
    res.render("courses/new");
  },

  // === Create and Save a New Course ===
  create: (req, res, next) => {
    // Extract data from the request body
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")], // Convert comma-separated items into an array
      zipCode: req.body.zipCode
    };

    // Save new course document to the database
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses"; // After saving, redirect to the courses page
        res.locals.course = course;       // Store course data for next middleware
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  // === Show a Single Course by ID ===
  show: (req, res, next) => {
    let courseId = req.params.id; // Get course ID from URL parameters

    // Find course by its ID
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course; // Store the course data for the view
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // === Render Single Course View ===
  showView: (req, res) => {
    // Renders the course details page using stored course data
    res.render("courses/show");
  },

  // === Render Edit Form for a Course ===
  edit: (req, res, next) => {
    let courseId = req.params.id;

    // Find course by ID and render edit form
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", { course: course });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // === Update an Existing Course ===
  update: (req, res, next) => {
    let courseId = req.params.id,
      // Extract and format updated course data
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")],
        zipCode: req.body.zipCode
      };

    // Find the course and update its data
    Course.findByIdAndUpdate(courseId, { $set: courseParams })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`; // Redirect to updated course page
        res.locals.course = course;                   // Store updated course data
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  // === Delete a Course by ID ===
  delete: (req, res, next) => {
    let courseId = req.params.id;

    // Find and remove the course document
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses"; // Redirect back to the course list
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  // === Redirect Helper Function ===
  redirectView: (req, res, next) => {
    // Redirects user if a redirect path is set, otherwise continue to next middleware
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
