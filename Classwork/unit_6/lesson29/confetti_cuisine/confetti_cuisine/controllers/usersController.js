"use strict"; // Enable strict mode to catch common JavaScript mistakes and enforce cleaner code

// === Import Dependencies ===
const { body, validationResult } = require('express-validator'); // Import validation and sanitization methods from express-validator
const User = require("../models/user"); // Import the Mongoose User model
const passport = require("passport"); // Import Passport for authentication

// === Helper Function ===
// Extract only the allowed user fields from request body to prevent unwanted data injection
const getUserParams = body => {
  return {
    name: {
      first: body.first, // First name of the user
      last: body.last // Last name of the user
    },
    email: body.email, // Email address
    password: body.password, // Password (handled by Passport-Local-Mongoose)
    zipCode: body.zipCode // User's zip/postal code
  };
};

// === Export Controller Methods ===
module.exports = {

  // === Fetch all users ===
  index: (req, res, next) => {
    User.find() // Query DB for all user documents
      .then(users => {
        res.locals.users = users; // Store users in res.locals for use in views or later middleware
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`); // Log any errors
        next(error); // Forward error to error-handling middleware
      });
  },

  // === Render user list view ===
  indexView: (req, res) => {
    res.render("users/index"); // Render "users/index" template (assumes users are in res.locals)
  },

  // === Render form to create new user ===
  new: (req, res) => {
    res.render("users/new"); // Render "users/new" template
  },

  // === Handle creation of a new user ===
  create: (req, res, next) => {
    if (req.skip) next(); // Skip creation if validation failed in previous middleware
    let newUser = new User(getUserParams(req.body)); // Create a new user object with sanitized data
    // Use Passport-Local-Mongoose to register user with hashed password
    User.register(newUser, req.body.password, (e, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`); // Flash success message
        res.locals.redirect = "/users"; // Set redirect path after successful creation
        next(); // Proceed to redirectView or next middleware
      } else {
        req.flash("error", `Failed to create user account because: ${e.message}.`); // Flash error message
        res.locals.redirect = "/users/new"; // Redirect back to creation form
        next();
      }
    });
  },

  // === Redirect helper ===
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect; // Retrieve redirect path from locals
    if (redirectPath !== undefined) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise, continue middleware chain
  },

  // === Fetch single user by ID ===
  show: (req, res, next) => {
    let userId = req.params.id; // Get user ID from route parameter
    User.findById(userId) // Find user document by ID
      .then(user => {
        res.locals.user = user; // Store user in res.locals for later middleware/view
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error
        next(error);
      });
  },

  // === Render user detail view ===
  showView: (req, res) => {
    res.render("users/show"); // Render "users/show" template
  },

  // === Render form to edit user ===
  edit: (req, res, next) => {
    let userId = req.params.id; // Get user ID from route
    User.findById(userId)
      .then(user => {
        res.render("users/edit", { user: user }); // Render edit form with pre-filled user data
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // === Update user ===
  update: (req, res, next) => {
    let userId = req.params.id; // Get user ID
    let userParams = getUserParams(req.body); // Extract updated user data
    User.findByIdAndUpdate(userId, { $set: userParams }) // Update user document
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Redirect to updated user's show page
        res.locals.user = user; // Store (pre-update) user data in locals
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  // === Delete user ===
  delete: (req, res, next) => {
    let userId = req.params.id; // Get user ID
    User.findByIdAndRemove(userId) // Delete user document
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to users list
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  // === Render login form ===
  login: (req, res) => {
    res.render("users/login"); // Render "users/login" template
  },

  // === Validation middleware array ===
  validate: [
    body("first").notEmpty().withMessage("First name cannot be empty"), // Validate first name
    body("last").notEmpty().withMessage("Last name cannot be empty"), // Validate last name
    body("email")
      .normalizeEmail({ all_lowercase: true }) // Normalize email
      .isEmail()
      .withMessage("Email is invalid"), // Validate email format
    body("zipCode")
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 })
      .withMessage("Zip code is invalid"), // Validate zip code
    body("password").notEmpty().withMessage("Password cannot be empty"), // Validate password
    (req, res, next) => { // Handle validation results
      const errors = validationResult(req); // Get validation errors
      if (!errors.isEmpty()) {
        let messages = errors.array().map(e => e.msg); // Extract error messages
        req.skip = true; // Skip user creation
        req.flash("error", messages.join(" and ")); // Flash errors
        res.locals.redirect = "/users/new"; // Redirect back to creation form
        next();
      } else {
        next(); // Proceed if no validation errors
      }
    }
  ],

  // === Authenticate user login ===
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login", // Redirect on failure
    failureFlash: "Failed to login.", // Flash error message
    successRedirect: "/", // Redirect on success
    successFlash: "Logged in!" // Flash success message
  }),

  // === Logout user ===
  logout: (req, res, next) => {
    req.logout((err) => { // Logout user using Passport's callback
      if (err) {
        return next(err); // Forward error if logout fails
      }
      req.flash("success", "You have been logged out!"); // Flash success message
      res.locals.redirect = "/"; // Redirect to homepage
      next();
    });
  },
};
