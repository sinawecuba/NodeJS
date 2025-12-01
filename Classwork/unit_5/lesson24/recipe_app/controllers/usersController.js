"use strict"; // Enable strict mode for safer JavaScript

// Import required modules
const User = require("../models/user"); // User Mongoose model
const { body, validationResult } = require("express-validator"); // Validation helpers
const passport = require("passport"); // Passport.js for authentication

/**
 * Helper function to extract user parameters from request body
 * @param {Object} body - The request body
 * @returns {Object} - Formatted user parameters
 */
const getUserParams = (body) => {
  return {
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    password: body.password,
    zipCode: body.zipCode,
  };
};

module.exports = {
  /**
   * Fetch all users from the database and store in res.locals for middleware chain
   */
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users; // Save users for view rendering
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error); // Forward error to error-handling middleware
      });
  },

  /**
   * Render the view listing all users
   */
  indexView: (req, res) => {
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!",
      },
    });
  },

  /**
   * Render the form to create a new user
   */
  new: (req, res) => {
    res.render("users/new"); // Render 'users/new.ejs'
  },

  /**
   * Create a new user and register it using Passport-local-mongoose
   */
  create: (req, res, next) => {
    if (req.skip) return next(); // Skip creation if flagged

    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/users"; // Redirect to users list
        next();
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/users/new"; // Redirect back to new user form
        next();
      }
    });
  },

  /**
   * Middleware to handle redirects
   */
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * Fetch a single user by ID and store it in res.locals
   */
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Render the view for a single user
   */
  showView: (req, res) => {
    res.render("users/show");
  },

  /**
   * Render the edit form for a user
   */
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", { user: user });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Update a user's information in the database
   */
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode,
      };

    User.findByIdAndUpdate(userId, { $set: userParams })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`; // Redirect to updated user's page
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Delete a user from the database
   */
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to user list after deletion
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  /**
   * Render the login form
   */
  login: (req, res) => {
    res.render("users/login"); // Render 'users/login.ejs'
  },

  /**
   * Authenticate user login using Passport.js
   */
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  /**
   * Logout the user and redirect to home page
   */
  logout: (req, res, next) => {
    req.logout(); // Passport logout
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
};

// ----------------------------
// Input Validation Middleware
// ----------------------------
exports.validate = [
  body("email").isEmail().withMessage("Email must be valid"), // Email validation
  body("zipCode").isPostalCode("any").withMessage("Invalid zip code"), // Zip code validation
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"), // Password length
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Flash all validation errors and redirect
      req.flash("error", errors.array().map(e => e.msg).join(" "));
      res.locals.redirect = "/users/new";
      next();
    } else next();
  }
];
