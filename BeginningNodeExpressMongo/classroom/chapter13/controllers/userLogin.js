const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.render('login', { error: 'Invalid username or password' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    // Save user in session
                    req.session.userId = user._id;
                    return res.redirect('/');
                } else {
                    return res.render('login', { error: 'Invalid username or password' });
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.render('login', { error: 'Something went wrong' });
        });
};
