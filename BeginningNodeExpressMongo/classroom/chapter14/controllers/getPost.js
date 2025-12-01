// Import the BlogPost model so we can query the database
const BlogPost = require('../models/BlogPost.js');

module.exports = async (req, res) => {
    // Find a single blog post by its ID, which comes from the URL parameters
    const blogpost = await BlogPost.findById(req.params.id);

    // Render the 'post' view and pass the retrieved blogpost data to the template
    res.render('post', { blogpost });
};
