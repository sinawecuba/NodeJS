"use strict"; // Enable strict mode for safer, cleaner JavaScript

// Import the Course model to interact with the "courses" collection in MongoDB
const Course = require("../models/course");

module.exports = {
  /**
   * Fetch all courses from the database.
   * Stores the result in res.locals.courses for use in views or next middleware.
   */
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses; // Make courses available for the next middleware
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error); // Pass the error to error-handling middleware
      });
  },

  /**
   * Render the view that displays all courses.
   */
  indexView: (req, res) => {
    res.render("courses/index"); // Render "courses/index.ejs"
  },

  /**
   * Render the form to create a new course.
   */
  new: (req, res) => {
    res.render("courses/new"); // Render "courses/new.ejs"
  },

  /**
   * Create a new course using form data from req.body.
   * Saves the new course to the database and sets redirect and course info in res.locals.
   */
  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")], // Split comma-separated items into an array
      zipCode: req.body.zipCode
    };

    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses"; // Redirect to courses list after creation
        res.locals.course = course; // Store created course for possible further use
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error); // Pass the error to error-handling middleware
      });
  },

  /**
   * Fetch a single course by its ID.
   * Stores the course in res.locals.course for use in views or next middleware.
   */
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course; // Make course available for next middleware
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Render the view to display a single course's details.
   */
  showView: (req, res) => {
    res.render("courses/show"); // Render "courses/show.ejs"
  },

  /**
   * Render the form to edit an existing course.
   * Fetches the course by ID and passes it to the view.
   */
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", { course: course }); // Render edit form with course data
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Update an existing course with form data from req.body.
   * Sets redirect and updated course info in res.locals.
   */
  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: [req.body.items.split(",")], // Split comma-separated items into an array
        zipCode: req.body.zipCode
      };

    Course.findByIdAndUpdate(courseId, { $set: courseParams })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`; // Redirect to the updated course page
        res.locals.course = course; // Store updated course for further use
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Delete a course by its ID.
   * Sets redirect path to courses list after deletion.
   */
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses"; // Redirect to course list after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  /**
   * Middleware to handle redirects.
   * If res.locals.redirect is set, redirect to that path; otherwise, continue to next middleware.
   */
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
