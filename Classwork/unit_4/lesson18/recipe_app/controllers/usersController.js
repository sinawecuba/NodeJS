"use strict"; // Enforces strict mode to catch common errors and enforce cleaner JavaScript syntax

const User = require("../models/user"); // Import the User model to interact with the "users" collection in MongoDB

// Export an object containing controller methods for handling user-related operations
module.exports = {

  // === CONTROLLER METHOD: index ===
  // Purpose: Retrieve all users from the database and pass them to the next middleware
  index: (req, res, next) => {
    User.find() // Fetch all user documents from the "users" collection
      .then(users => {
        // Store the list of users in res.locals so it can be accessed by the next middleware or view
        res.locals.users = users;
        next(); // Continue to the next middleware (e.g., indexView)
      })
      .catch(error => {
        // Log any error that occurs while fetching users
        console.log(`Error fetching users: ${error.message}`);
        // Pass the error to Express’s error-handling middleware
        next(error);
      });
  },

  // === CONTROLLER METHOD: indexView ===
  // Purpose: Render the "users/index" view to display all retrieved users
  indexView: (req, res) => {
    res.render("users/index"); // Render the EJS (or template engine) view for displaying user data
  }
};
