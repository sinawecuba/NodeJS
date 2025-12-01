// Export a route handler for rendering the registration page
module.exports = (req, res) => {

    // Render the 'register' view and pass in any validation errors
    // pulled from flash messages (if the form was previously submitted with errors)
    res.render('register', {
        errors: req.flash('validationErrors')
    });
};
