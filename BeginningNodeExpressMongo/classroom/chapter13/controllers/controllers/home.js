const BlogPost = require('../models/BlogPost.js');

module.exports = async (req, res) => {
    try {
        const blogposts = await BlogPost.find({});
        
        res.render('index', {
            blogposts
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.render('index', {
            blogposts: []
        });
    }
};