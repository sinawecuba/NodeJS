// Export a route handler for rendering the "create post" page
module.exports = (req, res) => {

    // Check if a user is logged in by verifying the session userId
    if (req.session.userId) {

        // If logged in, render the "create" view and pass a flag to the template
        return res.render("create", {
            createPost: true
        });
    }

    // If not logged in, redirect the user to the login page
    res.redirect('/auth/login');
};
