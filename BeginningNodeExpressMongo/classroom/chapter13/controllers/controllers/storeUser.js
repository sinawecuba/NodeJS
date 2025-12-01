const User = require('../models/User.js')
const path = require('path')

module.exports = async (req, res) => {  
    try {
        const user = await User.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.errors) {
            const validationErrors = Object.keys(error.errors)
                .map(key => error.errors[key].message);
            
            req.flash('validationErrors', validationErrors);
        } else {
            req.flash('validationErrors', ['An error occurred during registration']);
        }
        return res.redirect('/auth/register');
    }
}