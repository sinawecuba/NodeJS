"use strict"; // Enforce strict mode to catch common mistakes

// Import the User model
const User = require("../models/user"),
  // Import Passport for authentication
  passport = require("passport"),
  // Helper function to extract user data from request body
  getUserParams = body => {
    return {
      name: {
        first: body.first, // Get first name
        last: body.last // Get last name
      },
      email: body.email, // Get email
      password: body.password, // Get password
      zipCode: body.zipCode // Get zip code
    };
  };

// Export all controller methods
module.exports = {
  // Fetch all users from database
  index: (req, res, next) => {
    User.find() // Find all users
      .then(users => {
        res.locals.users = users; // Store users in res.locals for next middleware
        next(); // Call next middleware
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`); // Log errors
        next(error); // Pass error to error handling middleware
      });
  },

  // Render users index view
  indexView: (req, res) => {
    res.render("users/index"); // Render EJS template
  },

  // Render form to create a new user
  new: (req, res) => {
    res.render("users/new"); // Render EJS template for new user
  },

  // Create a new user
  create: (req, res, next) => {
    if (req.skip) next(); // Skip if validation failed

    let newUser = new User(getUserParams(req.body)); // Create new user instance
    User.register(newUser, req.body.password, (error, user) => { // Use Passport-local-mongoose to register
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`); // Success flash message
        res.locals.redirect = "/users"; // Redirect path after success
        next(); // Call next middleware
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`); // Error flash
        res.locals.redirect = "/users/new"; // Redirect path after failure
        next(); // Call next middleware
      }
    });
  },

  // Middleware to handle redirection
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect; // Get redirect path from locals
    if (redirectPath) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise, continue
  },

  // Fetch a single user by ID
  show: (req, res, next) => {
    let userId = req.params.id; // Get user ID from request parameters
    User.findById(userId) // Find user by ID
      .then(user => {
        res.locals.user = user; // Store user in locals
        next(); // Call next middleware
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error
        next(error); // Pass error to error middleware
      });
  },

  // Render single user view
  showView: (req, res) => {
    res.render("users/show"); // Render EJS template to show user
  },

  // Render edit form for a user
  edit: (req, res, next) => {
    let userId = req.params.id; // Get user ID from request params
    User.findById(userId) // Find user by ID
      .then(user => {
        res.render("users/edit", { user: user }); // Render edit form and pass user
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`); // Log error
        next(error); // Pass error to middleware
      });
  },

  // Update a user's information
  update: (req, res, next) => {
    let userId = req.params.id, // Get user ID
      userParams = { // Build updated user data
        name: {
          first: req.body.first, // Updated first name
          last: req.body.last // Updated last name
        },
        email: req.body.email, // Updated email
        password: req.body.password, // Updated password
        zipCode: req.body.zipCode // Updated zip code
      };

    User.findByIdAndUpdate(userId, { $set: userParams }) // Update user in DB
      .then(user => {
        res.locals.redirect = `/users/${userId}`; // Redirect to updated user page
        res.locals.user = user; // Store updated user in locals
        next(); // Call next middleware
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`); // Log error
        next(error); // Pass error to middleware
      });
  },

  // Delete a user
  delete: (req, res, next) => {
    let userId = req.params.id; // Get user ID
    User.findByIdAndRemove(userId) // Remove user from DB
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to users list
        next(); // Call next middleware
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`); // Log error
        next(); // Continue even if error occurs
      });
  },

  // Render login page
  login: (req, res) => {
    res.render("users/login"); // Render EJS login template
  },

  // Authenticate user using Passport
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login", // Redirect on failure
    failureFlash: "Failed to login.", // Flash message on failure
    successRedirect: "/", // Redirect on success
    successFlash: "Logged in!" // Flash message on success
  }),

  // Validate user input before creating account
  validate: (req, res, next) => {
    req
      .sanitizeBody("email") // Sanitize email
      .normalizeEmail({ all_lowercase: true }) // Normalize email
      .trim(); // Trim whitespace

    req.check("email", "Email is invalid").isEmail(); // Validate email format
    req
      .check("zipCode", "Zip code is invalid") // Validate zip code
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty(); // Validate password

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg); // Extract error messages
        req.skip = true; // Skip creation if validation fails
        req.flash("error", messages.join(" and ")); // Flash error messages
        res.locals.redirect = "/users/new"; // Redirect to new user form
        next(); // Call next middleware
      } else {
        next(); // Validation passed
      }
    });
  },

  // Logout user
  logout: (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  });
},
};