"use strict";

// =======================================
// Imports and constants
// =======================================
const token = process.env.TOKEN || "recipeT0k3n"; // Default API token if none provided
const User = require("../models/user"),
  jsonWebToken = require("jsonwebtoken"), // JWT handling
  passport = require("passport"),
  getUserParams = body => { // Helper function to extract user params from request body
    return {
      name: {
        first: body.first,
        last: body.last
      },
      email: body.email,
      password: body.password,
      zipCode: body.zipCode
    };
  };

module.exports = {
  // =======================================
  // Fetch all users from DB
  // Stores them in res.locals.users for downstream middleware
  // =======================================
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Render view to list all users
  // =======================================
  indexView: (req, res) => {
    res.render("users/index");
  },

  // =======================================
  // Render form to create a new user
  // =======================================
  new: (req, res) => {
    res.render("users/new");
  },

  // =======================================
  // Create a new user account
  // Uses Passport.js to register user securely
  // =======================================
  create: (req, res, next) => {
    if (req.skip) next(); // Skip if validation failed
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.fullName}'s account created successfully!`);
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash("error", `Failed to create user account because: ${error.message}.`);
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },

  // =======================================
  // Middleware to handle redirection
  // =======================================
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  // =======================================
  // Fetch single user by ID
  // =======================================
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Render view for a single user
  // =======================================
  showView: (req, res) => {
    res.render("users/show");
  },

  // =======================================
  // Render edit form for user
  // =======================================
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", { user: user });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Update user data in DB
  // =======================================
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: { first: req.body.first, last: req.body.last },
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
    User.findByIdAndUpdate(userId, { $set: userParams })
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Delete user from DB
  // =======================================
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  // =======================================
  // Render login page
  // =======================================
  login: (req, res) => {
    res.render("users/login");
  },

  // =======================================
  // Authenticate user using Passport.js
  // Redirects on success/failure with flash messages
  // =======================================
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  // =======================================
  // Validate user input during signup
  // Uses express-validator
  // =======================================
  validate: (req, res, next) => {
    req.sanitizeBody("email").normalizeEmail({ all_lowercase: true }).trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },

  // =======================================
  // Logout user and redirect
  // =======================================
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },

  // =======================================
  // Verify API token for routes
  // =======================================
  verifyToken: (req, res, next) => {
    let token = req.query.apiToken;
    if (token) {
      User.findOne({ apiToken: token })
        .then(user => {
          if (user) next();
          else next(new Error("Invalid API token."));
        })
        .catch(error => next(new Error(error.message)));
    } else {
      next(new Error("Invalid API token."));
    }
  },

  // =======================================
  // Authenticate user via API (JSON)
  // Returns signed JWT on success
  // =======================================
  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign(
          { data: user._id, exp: new Date().setDate(new Date().getDate() + 1) },
          "secret_encoding_passphrase"
        );
        res.json({ success: true, token: signedToken });
      } else {
        res.json({ success: false, message: "Could not authenticate user." });
      }
    })(req, res, next);
  },

  // =======================================
  // Verify JWT token for protected API routes
  // =======================================
  verifyJWT: (req, res, next) => {
    let token = req.headers.token;
    if (token) {
      jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => {
        if (payload) {
          User.findById(payload.data).then(user => {
            if (user) next();
            else res.status(httpStatus.FORBIDDEN).json({ error: true, message: "No User account found." });
          });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json({ error: true, message: "Cannot verify API token." });
          next();
        }
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({ error: true, message: "Provide Token" });
    }
  },
};
