// Import the BlogPost model to interact with the blog posts collection
const BlogPost = require('../models/BlogPost.js');

module.exports = async (req, res) => {
    try {
        // Fetch all blog posts from the database
        const blogposts = await BlogPost.find({});
        
        // Render the 'index' view and pass the list of blog posts to the template
        res.render('index', {
            blogposts
        });
    } catch (error) {
        // Log any errors that occur during the database query
        console.error('Error fetching blog posts:', error);

        // Render the 'index' view with an empty array to avoid breaking the page
        res.render('index', {
            blogposts: []
        });
    }
};
