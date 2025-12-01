// Export a route handler for logging a user out
module.exports = (req, res) => {

  // Destroy the current user session (logs the user out)
  req.session.destroy(() => {
    
    // After the session is destroyed, redirect the user to the homepage
    res.redirect('/');
  });
};
