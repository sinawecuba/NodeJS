"use strict"; // Enable strict mode to catch common JavaScript mistakes (like undeclared variables)

// === Import Dependencies ===
const Course = require("../models/course"); // Import the Course Mongoose model
const User = require("../models/user"); // Import the User Mongoose model
const httpStatus = require("http-status-codes"); // Import HTTP status codes for consistent API responses

// === Helper Function ===
// Extract only the allowed fields from request body to prevent unwanted data injection
const getCourseParams = (body) => ({
  title: body.title, // Course title
  description: body.description, // Course description
  maxStudents: body.maxStudents, // Maximum number of students allowed
  cost: body.cost // Cost of the course
});

// === Export Controller Methods ===
module.exports = { // Export an object with all controller methods

  // === List all courses ===
  index: (req, res, next) => { // Middleware: fetch all courses from DB
    Course.find() // Query database for all Course documents
      .then((courses) => { // On successful fetch
        res.locals.courses = courses; // Store courses in res.locals to share with later middleware/views
        next(); // Continue to the next middleware
      })
      .catch((error) => { // Handle database errors
        console.log(`Error fetching courses: ${error.message}`); // Log error to console
        next(error); // Pass error to error-handling middleware
      });
  },

  // === Render index view for courses ===
  indexView: (req, res) => { // Middleware: render the template for course listing
    res.render("courses/index", { courses: res.locals.courses }); // Render "courses/index" template and pass courses
  },

  // === Render form to create a new course ===
  new: (req, res) => { // Middleware: display a form for creating a course
    res.render("courses/new"); // Render "courses/new" template (no dynamic data needed)
  },

  // === Create a new course ===
  create: (req, res, next) => { // Middleware: handle creation of new course from form data
    const courseParams = getCourseParams(req.body); // Extract only allowed fields from request body
    Course.create(courseParams) // Save a new Course document to the database
      .then((course) => { // On successful creation
        res.locals.redirect = "/courses"; // Set redirect path to course listing
        res.locals.course = course; // Store newly created course in res.locals
        next(); // Proceed to next middleware (usually redirectView)
      })
      .catch((error) => { // Handle creation errors
        console.log(`Error saving course: ${error.message}`); // Log error
        next(error); // Pass error to error-handling middleware
      });
  },

  // === Redirect middleware ===
  redirectView: (req, res, next) => { // Middleware: perform redirect if res.locals.redirect is set
    const redirectPath = res.locals.redirect; // Read redirect path from res.locals
    if (redirectPath) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise, continue to next middleware
  },

  // === Find a course by ID ===
  show: (req, res, next) => { // Middleware: fetch a single course using its ID
    const courseId = req.params.id; // Get course ID from URL parameter
    Course.findById(courseId) // Query DB for course by ID
      .then((course) => { // On successful fetch
        res.locals.course = course; // Store course in res.locals for use in views
        next(); // Continue to next middleware
      })
      .catch((error) => { // Handle errors
        console.log(`Error fetching course by ID: ${error.message}`); // Log error
        next(error); // Pass error to error-handling middleware
      });
  },

  // === Render view for a single course ===
  showView: (req, res) => { // Middleware: display a single course
    res.render("courses/show", { course: res.locals.course }); // Render "courses/show" template
  },

  // === Render form to edit a course ===
  edit: (req, res, next) => { // Middleware: display edit form with pre-filled course data
    const courseId = req.params.id; // Get course ID from URL
    Course.findById(courseId) // Fetch course from DB
      .then((course) => { // On success
        res.render("courses/edit", { course }); // Render "courses/edit" template with course data
      })
      .catch((error) => { // Handle errors
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error); // Pass error to error-handling middleware
      });
  },

  // === Update an existing course ===
  update: (req, res, next) => { // Middleware: update course details
    const courseId = req.params.id; // Get course ID from URL
    const courseParams = getCourseParams(req.body); // Extract sanitized update fields

    Course.findByIdAndUpdate(courseId, { $set: courseParams }) // Update course document using $set
      .then((course) => { // On successful update
        res.locals.redirect = `/courses/${courseId}`; // Set redirect to the course's show page
        res.locals.course = course; // Store the (pre-update) course in res.locals
        next(); // Proceed to next middleware
      })
      .catch((error) => { // Handle errors during update
        console.log(`Error updating course: ${error.message}`);
        next(error); // Pass error to error-handling middleware
      });
  },

  // === Delete a course ===
  delete: (req, res, next) => { // Middleware: remove a course from DB
    const courseId = req.params.id; // Get course ID from URL
    Course.findByIdAndRemove(courseId) // Remove course document by ID
      .then(() => { // On successful deletion
        res.locals.redirect = "/courses"; // Redirect to course listing
        next(); // Proceed to redirectView
      })
      .catch((error) => { // Handle deletion errors
        console.log(`Error deleting course: ${error.message}`);
        next(error); // Pass error
      });
  },

  // === Respond with JSON (for APIs) ===
  respondJSON: (req, res) => { // Middleware: send JSON response
    res.json({
      status: httpStatus.OK, // HTTP 200
      data: res.locals // Send data stored in res.locals
    });
  },

  // === Handle JSON errors (for APIs) ===
  errorJSON: (error, req, res, next) => { // Middleware: send JSON error
    let errorObject;
    if (error) { // If there is an error
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR, // HTTP 500
        message: error.message // Send error message
      };
    } else { // Unknown error
      errorObject = {
        status: httpStatus.OK, // Default to HTTP 200
        message: "Unknown Error."
      };
    }
    res.json(errorObject); // Send JSON error response
  },

  // === Filter courses based on current user enrollment ===
  filterUserCourses: (req, res, next) => { // Middleware: mark which courses the user has joined
    let currentUser = res.locals.currentUser; // Get current logged-in user
    if (currentUser) {
      let mappedCourses = res.locals.courses.map((course) => {
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id); // Check if user is enrolled in the course
        });
        return Object.assign(course.toObject(), { joined: userJoined }); // Add "joined" flag to course object
      });
      res.locals.courses = mappedCourses; // Replace courses with enriched data
      next();
    } else {
      next(); // If no user, just continue
    }
  },

  // === Enroll current user in a course ===
  join: (req, res, next) => { // Middleware: add course to user's enrolled courses
    let courseId = req.params.id; // Get course ID from URL
    let currentUser = req.user; // Get current logged-in user
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: { courses: courseId } // Add courseId to user's courses array (avoid duplicates)
      })
        .then(() => {
          res.locals.success = true; // Mark success
          next(); // Continue to next middleware
        })
        .catch(error => {
          next(error); // Handle errors
        });
    } else {
      next(new Error("User must log in.")); // Error if user not logged in
    }
  },
}; // End module.exports object
