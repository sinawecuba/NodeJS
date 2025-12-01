// Import the User model to create new users in the database
const User = require('../models/User.js');
const path = require('path');

module.exports = async (req, res) => {  
    try {
        // Attempt to create a new user using submitted form data
        const user = await User.create(req.body);

        // If successful, redirect the user to the homepage
        res.redirect('/');
    } catch (error) {
        // If Mongoose validation errors exist, extract the error messages
        if (error.errors) {
            const validationErrors = Object.keys(error.errors)
                .map(key => error.errors[key].message);

            // Store validation messages in flash storage for display on the form
            req.flash('validationErrors', validationErrors);
        } else {
            // If it's some other type of error, show a generic message
            req.flash('validationErrors', ['An error occurred during registration']);
        }

        // Redirect the user back to the registration page to fix errors
        return res.redirect('/auth/register');
    }
};
