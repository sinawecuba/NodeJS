// Import the BlogPost model to save new posts to the database
const BlogPost = require('../models/BlogPost.js');
// Import path for handling and constructing file paths
const path = require('path');

module.exports = (req, res) => {
    // Get the uploaded image file from the request
    let image = req.files.image;

    // Move the uploaded image to the public/img directory
    image.mv(
        path.resolve(__dirname, '..', 'public/img', image.name),
        
        // Callback executed after the file is moved
        async (error) => {
            // Create a new BlogPost entry using form data and the saved image path
            await BlogPost.create({
                ...req.body,     // Spread form fields (title, content, etc.)
                image: '/img/' + image.name  // Save image path in the database
            });

            // Redirect the user back to the homepage after creation
            res.redirect('/');
        }
    );
};
