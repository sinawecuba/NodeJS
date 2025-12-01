"use strict";

// =======================================
// Import dependencies and models
// =======================================
const Course = require("../models/course");  // Mongoose model for courses
const httpStatus = require("http-status-codes"); // Standard HTTP status codes
const User = require("../models/user");      // Mongoose model for users

module.exports = {

  // =======================================
  // Fetch all courses from DB
  // Stores them in res.locals.courses for downstream middleware
  // =======================================
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error); // Pass error to error handling middleware
      });
  },

  // =======================================
  // Render view for listing courses
  // Could optionally return JSON (commented out)
  // =======================================
  indexView: (req, res) => {
    // res.render() sends the EJS template to the browser
    res.render("courses/index");
  },

  // =======================================
  // Render form for creating a new course
  // =======================================
  new: (req, res) => {
    res.render("courses/new");
  },

  // =======================================
  // Create a new course in the database
  // =======================================
  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(",")], // Convert comma-separated string to array
      zipCode: req.body.zipCode
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses"; // Redirect path after creation
        res.locals.course = course;
        next(); // Proceed to redirect middleware
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Fetch a single course by ID
  // Store it in res.locals.course for downstream use
  // =======================================
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Render view to show a single course
  // =======================================
  showView: (req, res) => {
    res.render("courses/show");
  },

  // =======================================
  // Render form for editing a course
  // =======================================
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", { course: course });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Update course information in the database
  // =======================================
  update: (req, res, next) => {
    let courseId = req.params.id,
        courseParams = {
          title: req.body.title,
          description: req.body.description,
          items: [req.body.items.split(",")],
          zipCode: req.body.zipCode
        };

    Course.findByIdAndUpdate(courseId, { $set: courseParams })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`; // Redirect to updated course
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Delete a course from the database
  // =======================================
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

  // =======================================
  // Middleware to handle redirection after operations
  // =======================================
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  // =======================================
  // Respond with courses data in JSON format
  // Used for API endpoints
  // =======================================
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK, // HTTP 200
      data: res.locals // Data from previous middleware (courses, etc.)
    });
  },

  // =======================================
  // Respond with JSON error (HTTP 500)
  // Used for API endpoints
  // =======================================
  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error"
      };
    }
    res.json(errorObject);
  },

  // =======================================
  // Allow a user to join a course
  // =======================================
  join: (req, res, next) => {
    let courseId = req.params.id;
    let currentUser = req.user;

    if (currentUser) { // Ensure user is logged in
      User.findByIdAndUpdate(currentUser, {
        $addToSet: { courses: courseId } // Add course ID if not already enrolled
      })
      .then(() => {
        res.locals.success = true; // Flag success for downstream middleware
        next();
      })
      .catch(error => {
        next(error);
      });
    } else {
      next(new Error("User must login first"));
    }
  },

  // =======================================
  // Add "joined" property to courses based on whether user is enrolled
  // =======================================
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;

    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        // Check if the user has joined this course
        let userJoined = currentUser.courses.some(userCourse => userCourse.equals(course._id));
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses; // Overwrite courses with enriched data
      next();
    } else {
      next();
    }
  }
};
