"use strict"; // enable strict mode to catch common JS mistakes (e.g., accidental globals)

 // === Import Course Model ===
const Course = require("../models/course"); // import the Mongoose Course model from models/course

 // === Helper Function ===
const getCourseParams = (body) => ({ // define a function that extracts allowed fields from req.body
  title: body.title, // map request body title to course title
  description: body.description, // map request body description to course description
  maxStudents: body.maxStudents, // map request body maxStudents to course maxStudents
  cost: body.cost // map request body cost to course cost
}); // end of getCourseParams function

 // === Export Controller Methods ===
module.exports = { // begin exporting an object containing controller methods
  // === List all courses ===
  index: (req, res, next) => { // middleware: find all courses and attach them to res.locals
    Course.find() // query the database for all Course documents
      .then((courses) => { // on success, receive the courses array
        res.locals.courses = courses; // store courses on res.locals for later middleware/views
        next(); // call next middleware in the chain
      }) // end then
      .catch((error) => { // handle any error from the DB query
        console.log(`Error fetching courses: ${error.message}`); // log the error message
        next(error); // forward the error to error-handling middleware
      }); // end catch
  }, // end index method

  // === Render the index view ===
  indexView: (req, res) => { // middleware: render the view that lists courses
    res.render("courses/index", { courses: res.locals.courses }); // render the "courses/index" template, passing courses from res.locals
  }, // end indexView

  // === Render form for new course ===
  new: (req, res) => { // middleware: render the form to create a new course
    res.render("courses/new"); // render the "courses/new" template (no data required)
  }, // end new

  // === Create a new course ===
  create: (req, res, next) => { // middleware: create a new Course document from form data
    const courseParams = getCourseParams(req.body); // extract allowed fields from the request body into courseParams
    Course.create(courseParams) // create and save a new Course document with those params
      .then((course) => { // on success, receive the created course document
        res.locals.redirect = "/courses"; // set redirect path to the courses list
        res.locals.course = course; // store the created course on res.locals if later middleware needs it
        next(); // move to the next middleware (often redirectView)
      }) // end then
      .catch((error) => { // handle any error during creation
        console.log(`Error saving course: ${error.message}`); // log the error
        next(error); // forward error to error-handling middleware
      }); // end catch
  }, // end create

  // === Redirect helper ===
  redirectView: (req, res, next) => { // middleware: perform a redirect if res.locals.redirect is set
    const redirectPath = res.locals.redirect; // read the redirect path from res.locals
    if (redirectPath) res.redirect(redirectPath); // if it exists, redirect the response to that path
    else next(); // otherwise, call next() to continue the chain
  }, // end redirectView

  // === Find a course by ID ===
  show: (req, res, next) => { // middleware: find a single Course by its ID param
    const courseId = req.params.id; // read the course id from the route parameters
    Course.findById(courseId) // query the DB for a Course document with that id
      .then((course) => { // on success, receive the found course (or null)
        res.locals.course = course; // store the found course on res.locals for later middleware/views
        next(); // continue to next middleware
      }) // end then
      .catch((error) => { // handle any query error
        console.log(`Error fetching course by ID: ${error.message}`); // log the error
        next(error); // forward error
      }); // end catch
  }, // end show

  // === Render single course view ===
  showView: (req, res) => { // middleware: render the template that shows details of one course
    res.render("courses/show", { course: res.locals.course }); // render "courses/show" passing the course from res.locals
  }, // end showView

  // === Render edit form for a course ===
  edit: (req, res, next) => { // middleware: render a form pre-filled with an existing course for editing
    const courseId = req.params.id; // get the id from req.params
    Course.findById(courseId) // find the course by id
      .then((course) => { // on success, receive the course
        res.render("courses/edit", { course }); // render "courses/edit" and pass the course object for pre-filling the form
      }) // end then
      .catch((error) => { // handle error retrieving the course
        console.log(`Error fetching course by ID: ${error.message}`); // log the error
        next(error); // forward the error
      }); // end catch
  }, // end edit

  // === Update course ===
  update: (req, res, next) => { // middleware: update an existing course with new form data
    const courseId = req.params.id; // get the course id from route params
    const courseParams = getCourseParams(req.body); // extract sanitized update params from req.body

    Course.findByIdAndUpdate(courseId, { $set: courseParams }) // update the document fields with $set
      .then((course) => { // on success, receive the original (pre-update) course document by default
        res.locals.redirect = `/courses/${courseId}`; // set redirect to the show page for the updated course
        res.locals.course = course; // store the course on res.locals (note: this is the pre-update version unless options changed)
        next(); // continue to next middleware (usually redirectView)
      }) // end then
      .catch((error) => { // handle update error
        console.log(`Error updating course: ${error.message}`); // log the error
        next(error); // forward the error
      }); // end catch
  }, // end update

  // === Delete course ===
  delete: (req, res, next) => { // middleware: remove a course document by id
    const courseId = req.params.id; // get id from params
    Course.findByIdAndRemove(courseId) // remove the document with this id
      .then(() => { // on success, no document returned
        res.locals.redirect = "/courses"; // set redirect path back to the list of courses
        next(); // continue to next middleware (redirectView)
      }) // end then
      .catch((error) => { // handle deletion error
        console.log(`Error deleting course: ${error.message}`); // log the error
        next(error); // forward the error
      }); // end catch
  } // end delete
}; // end module.exports object
