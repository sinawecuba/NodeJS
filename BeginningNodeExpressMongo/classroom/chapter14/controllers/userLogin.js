// Import the User model to query the database for user authentication
const User = require('../models/User');
// Import bcrypt for password hashing and comparison
const bcrypt = require('bcryptjs');

module.exports = (req, res) => {
    // Destructure username and password from the request body
    const { username, password } = req.body;

    // Find a user in the database with the provided username
    User.findOne({ username: username })
        .then(user => {
            // If no user is found, render the login page with an error message
            if (!user) {
                return res.render('login', { error: 'Invalid username or password' });
            }

            // Compare the submitted password with the hashed password stored in the database
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    // If passwords match, save the user's ID in the session (logs them in)
                    req.session.userId = user._id;
                    console.log('User logged in, redirecting to home:', user._id); // Logging for debugging
                    return res.redirect('/'); // Redirect to homepage after successful login
                } else {
                    // If password doesn't match, render login page with an error message
                    return res.render('login', { error: 'Invalid username or password' });
                }
            });
        })
        .catch(err => {
            // Catch and log any errors during the database query or bcrypt comparison
            console.log('Login error:', err);
            // Render the login page with a generic error message
            return res.render('login', { error: 'Something went wrong' });
        });
};
