const BlogPost = require('../models/BlogPost.js');

module.exports = async (req, res) => {
    // req exists here, inside the controller function
    console.log(req.session);

    const blogposts = await BlogPost.find({});
    
    res.render('index', {
        blogposts
    });
};
