"use strict"; // Enforce strict mode for safer JavaScript

const User = require("../models/user"); // Import User model

module.exports = {
  // --- FETCH ALL USERS ---
  index: (req, res, next) => {
    User.find() // Retrieve all users from the database
      .then(users => {
        res.locals.users = users; // Store users in res.locals for the view
        next(); // Pass control to next middleware/controller
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error); // Pass error to error-handling middleware
      });
  },

  // Render the users index view
  indexView: (req, res) => {
    res.render("users/index");
  },

  // Render form for creating a new user
  new: (req, res) => {
    res.render("users/new");
  },

  // Create a new user in the database
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users"; // Path to redirect after creation
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },

  // --- FETCH A SINGLE USER ---
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId) // Find user by ID
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // Render view for a single user
  showView: (req, res) => {
    res.render("users/show");
  },

  // --- EDIT USER ---
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", { user }); // Render edit form with user data
      })
      .catch(error => {
        console.log(`Error loading user for edit: ${error.message}`);
        next(error);
      });
  },

  // Update user data
  update: (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    User.findByIdAndUpdate(userId, { $set: userParams }) // Update user by ID
      .then(() => {
        res.locals.redirect = `/users/${userId}`; // Redirect to updated user page
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  // Delete a user
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId) // Remove user by ID
      .then(() => {
        res.locals.redirect = "/users"; // Redirect to users list after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next(error);
      });
  },

  // Redirect middleware
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise continue to next middleware
  }
};
