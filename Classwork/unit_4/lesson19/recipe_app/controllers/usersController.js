"use strict"; // Enforce strict mode for cleaner and safer JavaScript

// === IMPORT USER MODEL ===
// The User model allows interaction with the "users" collection in MongoDB
const User = require("../models/user");

// === EXPORT CONTROLLER METHODS ===
module.exports = {

  // === INDEX ACTION (FETCH ALL USERS) ===
  // Middleware that retrieves all users from the database
  index: (req, res, next) => {
    User.find() // Find all user documents
      .then(users => {
        res.locals.users = users; // Store retrieved users in res.locals for later use
        next(); // Pass control to the next middleware (usually indexView)
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`); // Log errors
        next(error); // Pass error to error-handling middleware
      });
  },

  // === INDEX VIEW ACTION ===
  // Renders the "users/index" template to display all users
  indexView: (req, res) => {
    res.render("users/index"); // Render EJS view for users list
  },

  // === NEW USER FORM ACTION ===
  // Renders a form for creating a new user
  new: (req, res) => {
    res.render("users/new"); // Render EJS view for new user form
  },

  // === CREATE ACTION (SAVE NEW USER) ===
  // Handles POST requests to create a new user in the database
  create: (req, res, next) => {
    // Collect user input from request body
    let userParams = {
      name: {
        first: req.body.first, // First name from form
        last: req.body.last    // Last name from form
      },
      email: req.body.email,       // Email from form
      password: req.body.password, // Password from form
      zipCode: req.body.zipCode    // Zip code from form
    };

    // Create a new User document
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users"; // Store redirect path for later middleware
        res.locals.user = user;         // Store the created user in res.locals
        next();                         // Pass control to next middleware (redirectView)
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`); // Log any errors
        next(error);                                        // Pass error to error-handling middleware
      });
  },

  // === REDIRECT VIEW MIDDLEWARE ===
  // Redirects the client to a specified path stored in res.locals.redirect
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath); // Redirect if path exists
    else next();                                  // Otherwise, continue
  },

  // === SHOW ACTION (FETCH USER BY ID) ===
  // Middleware that retrieves a single user by ID from the database
  show: (req, res, next) => {
    let userId = req.params.id; // Get user ID from route parameters
    User.findById(userId)       // Find user document by ID
      .then(user => {
        res.locals.user = user; // Store user in res.locals for later middleware/view
        next();                  // Pass control to showView
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log errors
        next(error); // Pass error to error-handling middleware
      });
  },

  // === SHOW VIEW ACTION ===
  // Renders a page displaying details of a single user
  showView: (req, res) => {
    res.render("users/show"); // Render EJS view for a single user
  }
};
