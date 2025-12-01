"use strict";

const Course = require("../models/course");

module.exports = {
  // List all courses
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },

  // Render courses index view or JSON
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.courses);
    } else {
      res.render("courses/index", { courses: res.locals.courses });
    }
  },

  // Render form for new course
  new: (req, res) => {
    res.render("courses/new"); // new course form
  },

  // Create a new course
  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: req.body.items.split(","), // store as array
      zipCode: req.body.zipCode
    };
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  // Show single course by ID
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

  // Render single course view
  showView: (req, res) => {
    res.render("courses/show", { course: res.locals.course });
  },

  // Render edit form for a course
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

  // Update a course
  update: (req, res, next) => {
    let courseId = req.params.id;
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: req.body.items.split(","),
      zipCode: req.body.zipCode
    };

    
Course.findByIdAndUpdate(courseId, { $set: courseParams })
  .then(course => {
    res.locals.redirect = `/ courses / ${ courseId } `;
    res.locals.course = course;
    next();
  })
  .catch(error => {
    console.log(`Error updating course by ID: ${ error.message } `);
    next(error);
  });


  },

  // Delete a course
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  // Handle redirects
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
