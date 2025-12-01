"use strict"; // Enforce strict mode to catch common mistakes

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const Course = require("../models/course"); // Mongoose model for the Course collection
const httpStatus = require("http-status-codes"); // Standard HTTP status codes
const User = require("../models/user"); // Mongoose model for the User collection

// ----------------------------
// CONTROLLER METHODS
// ----------------------------
module.exports = {
  // GET /courses - fetch all courses from DB
  index: (req, res, next) => {
    Course.find({}) // Find all courses
      .then(courses => {
        res.locals.courses = courses; // Store courses in locals for downstream middleware
        next(); // Call next middleware
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`); // Log error
        next(error); // Pass error to error-handling middleware
      });
  },

  // Render courses index view
  indexView: (req, res) => {
    // Could support JSON format via query param (commented out)
    // if (req.query.format === "json") {
    //   res.json(res.locals.courses);
    // } else {
    //   res.render("courses/index");
    // }
    res.render("courses/index"); // Render the EJS view
  },

  // Render new course form
  new: (req, res) => {
    res.render("courses/new"); // Render 'new course' form
  },

  // POST /courses - create a new course
  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title, // Course title from form
      description: req.body.description, // Course description
      items: [req.body.items.split(",")], // Convert comma-separated items into array
      zipCode: req.body.zipCode // Course zip code
    };

    Course.create(courseParams) // Save course to DB
      .then(course => {
        res.locals.redirect = "/courses"; // Set redirect path after creation
        res.locals.course = course; // Store created course in locals
        next(); // Call redirect middleware
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  // GET /courses/:id - fetch a single course by ID
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course; // Store course in locals
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // Render single course view
  showView: (req, res) => {
    res.render("courses/show"); // Render course detail page
  },

  // Render course edit form
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", { course: course }); // Pass course to edit view
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // PUT /courses/:id - update course details
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
        res.locals.redirect = `/courses/${courseId}`; // Redirect to updated course page
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  // DELETE /courses/:id - remove a course
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses"; // Redirect to courses list after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  // Middleware to handle redirection
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath); // Redirect if path is set
    else next(); // Otherwise, move to next middleware
  },

  // Send JSON response of data
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK, // HTTP 200
      // res.locals contains data from previous middleware
      data: res.locals
    });
  },

  // Send JSON response for errors instead of redirecting
  errorJSON: (error, req, res, next) => {
    let errorObject;

    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
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

  // Allow a logged-in user to join a course
  join: (req, res, next) => {
    let courseId = req.params.id;
    let currentUser = req.user; // Currently logged-in user

    if (currentUser) { // Check if user is logged in
      User.findByIdAndUpdate(currentUser, {
        $addToSet: { courses: courseId } // Add course ID to user's courses if not already present
      })
      .then(() => {
        res.locals.success = true; // Indicate join success
        next();
      })
      .catch(error => next(error));
    } else {
      next(new Error("User must login first")); // Error if user not logged in
    }
  },

  // Mark courses that the current user has joined
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser; // Logged-in user stored in locals

    if (currentUser) {
      // Map over courses and check if user has joined each one
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id); // Compare ObjectIDs
        });
        // Merge course object with a 'joined' property
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses; // Update courses with joined info
      next();
    } else {
      next(); // If no user, continue without modifying courses
    }
  }
};
