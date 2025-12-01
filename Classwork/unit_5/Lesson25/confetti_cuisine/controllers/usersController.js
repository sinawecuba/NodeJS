"use strict"; // Enables strict mode for better error handling and cleaner JavaScript
const { body, validationResult } = require('express-validator'); // Imports express-validator methods for input validation
const User = require("../models/user"), // Imports the User model
  passport = require("passport"), // Imports Passport for authentication
  getUserParams = body => { // Helper function to extract user data from request body
    return {
      name: {
        first: body.first, // User's first name
        last: body.last // User's last name
      },
      email: body.email, // User's email
      password: body.password, // User's password
      zipCode: body.zipCode // User's zip code
    };
  };

module.exports = { // Export all controller functions
  index: (req, res, next) => { // Fetch all users
    User.find()
      .then(users => {
        res.locals.users = users; // Store users in response locals
        next(); // Pass control to next middleware
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`); // Log any errors
        next(error); // Pass error to next middleware
      });
  },

  indexView: (req, res) => { // Render the user list view
    res.render("users/index");
  },

  new: (req, res) => { // Render form for creating a new user
    res.render("users/new");
  },

  create: (req, res, next) => { // Handle new user creation
    if (req.skip) next(); // Skip if validation failed
    let newUser = new User(getUserParams(req.body)); // Create new user object
    User.register(newUser, req.body.password, (e, user) => { // Register new user using Passport-Local-Mongoose
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`); // Success message
        res.locals.redirect = "/users"; // Redirect path after creation
        next();
      } else {
        req.flash("error", `Failed to create user account because: ${e.message}.`); // Error message
        res.locals.redirect = "/users/new"; // Redirect to new user form
        next();
      }
    });
  },

  redirectView: (req, res, next) => { // Handle redirects
    let redirectPath = res.locals.redirect; // Retrieve redirect path
    if (redirectPath !== undefined) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise, continue
  },

  show: (req, res, next) => { // Fetch single user by ID
    let userId = req.params.id; // Get user ID from URL
    User.findById(userId)
      .then(user => {
        res.locals.user = user; // Store user in locals
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error
        next(error);
      });
  },

  showView: (req, res) => { // Render user details view
    res.render("users/show");
  },

  edit: (req, res, next) => { // Render edit user form
    let userId = req.params.id; // Get user ID
    User.findById(userId)
      .then(user => {
        res.render("users/edit", { user: user }); // Render edit form with user data
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error
        next(error);
      });
  },

  update: (req, res, next) => { // Handle user updates
    let userId = req.params.id, // Get user ID
      userParams = getUserParams(req.body); // Extract updated info

    User.findByIdAndUpdate(userId, { $set: userParams }) // Update user record
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Redirect to user profile
        res.locals.user = user; // Store updated user
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`); // Log error
        next(error);
      });
  },

  delete: (req, res, next) => { // Delete a user by ID
    let userId = req.params.id; // Get user ID
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to users list
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`); // Log error
        next();
      });
  },

  login: (req, res) => { // Render login page
    res.render("users/login");
  },

  validate: [ // Validation middleware array
    body("first").notEmpty().withMessage("First name cannot be empty"), // Validate first name
    body("last").notEmpty().withMessage("Last name cannot be empty"), // Validate last name
    body("email")
      .normalizeEmail({ all_lowercase: true }) // Normalize email
      .isEmail()
      .withMessage("Email is invalid"), // Validate email
    body("zipCode")
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 })
      .withMessage("Zip code is invalid"), // Validate zip code
    body("password").notEmpty().withMessage("Password cannot be empty"), // Validate password
    (req, res, next) => { // Handle validation results
      const errors = validationResult(req); // Check for errors
      if (!errors.isEmpty()) { // If validation fails
        let messages = errors.array().map(e => e.msg); // Collect error messages
        req.skip = true; // Skip user creation
        req.flash("error", messages.join(" and ")); // Flash error message
        res.locals.redirect = "/users/new"; // Redirect back to form
        next();
      } else {
        next(); // Proceed if validation passed
      }
    }
  ],

  authenticate: passport.authenticate("local", { // Use Passport for login authentication
    failureRedirect: "/users/login", // Redirect if login fails
    failureFlash: "Failed to login.", // Flash error message
    successRedirect: "/", // Redirect on success
    successFlash: "Logged in!" // Flash success message
  }),

  logout: (req, res, next) => { // Handle user logout
    req.logout((err) => { // Log user out of session with callback
      if (err) {
        return next(err); // Pass error to error handler if logout fails
      }
      req.flash("success", "You have been logged out!"); // Flash success message
      res.locals.redirect = "/"; // Redirect to homepage
      next();
    });
  },
};
