// Export a function to handle an incoming request
module.exports = (req, res) => {

    // Render the 'about' view/template when this route is accessed
    res.render('about');
};
