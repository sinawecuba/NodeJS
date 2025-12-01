"use strict"; // Enforce strict mode for safer, cleaner JavaScript code

// Import the User model (used to interact with the users collection in MongoDB)
const User = require("../models/user");

// Import validation tools from express-validator for form input validation
const { body, validationResult } = require("express-validator");

/**
 * Helper function to extract and format user parameters from the request body.
 * This ensures consistent user object creation throughout the controller.
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

// Export all controller methods as part of module.exports
module.exports = {
  /**
   * Fetch all users from the database and store them in res.locals for rendering.
   */
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users; // Make the users available to the next middleware or view
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`); // Log any errors
        next(error); // Pass the error to Express error handling
      });
  },

  /**
   * Render the users index page.
   * Displays a success message once all users are loaded.
   */
  indexView: (req, res) => {
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!",
      },
    });
  },

  /**
   * Render the new user registration form.
   */
  new: (req, res) => {
    res.render("users/new");
  },

  /**
   * Create a new user record in the database from form data.
   * Uses getUserParams() to format the input.
   * Displays success or error flash messages depending on the outcome.
   */
  create: (req, res, next) => {
    let userParams = getUserParams(req.body);

    User.create(userParams)
      .then((user) => {
        // Success: Show confirmation message and redirect to /users
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        // Failure: Log error and redirect back to registration page
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        next();
      });
  },

  /**
   * Redirect middleware — handles post-action redirects.
   * If a redirect path exists in res.locals, perform the redirect.
   */
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  /**
   * Find and load a single user by ID.
   * The user is stored in res.locals for the next middleware or view.
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
   * Render a view to show details for a single user.
   */
  showView: (req, res) => {
    res.render("users/show");
  },

  /**
   * Render a form for editing an existing user's details.
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
   * Update an existing user's record in the database.
   * Uses the ID from route parameters and form data from the request body.
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
        res.locals.redirect = `/users/${userId}`; // Redirect to the updated user's page
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Delete a user record from the database based on their ID.
   * Redirects back to the user list after deletion.
   */
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  /**
   * Render the user login page.
   */
  login: (req, res) => {
    res.render("users/login");
  },

  /**
   * Authenticate a user during login.
   * Checks the database for the email, verifies the password, and redirects appropriately.
   */
  authenticate: (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          // Compare provided password with hashed password in database
          user.passwordComparison(req.body.password)
            .then((passwordsMatch) => {
              if (passwordsMatch) {
                // Success: password matches
                req.flash("success", `${user.fullName} logged in successfully!`);
                res.locals.redirect = `/users/${user._id}`;
              } else {
                // Wrong password
                req.flash("error", "Incorrect password.");
                res.locals.redirect = "/users/login";
              }
              next();
            });
        } else {
          // No user found with that email
          req.flash("error", "User not found.");
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch((error) => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  },
};

/**
 * Validation middleware for user input.
 * Checks if email, zip code, and password fields are valid before proceeding.
 */
exports.validate = [
  // Ensure email is properly formatted
  body("email").isEmail().withMessage("Email must be valid"),

  // Validate postal/zip code format
  body("zipCode").isPostalCode("any").withMessage("Invalid zip code"),

  // Enforce a minimum password length of 8 characters
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  // Handle validation results and return flash messages if validation fails
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect all validation error messages and display them using flash
      req.flash("error", errors.array().map((e) => e.msg).join(" "));
      res.locals.redirect = "/users/new"; // Redirect back to the signup form
      next();
    } else next(); // Proceed if all fields are valid
  },
];
