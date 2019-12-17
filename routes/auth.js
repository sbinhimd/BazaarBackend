const express = require('express');
const router  = express.Router();

const jwt      = require('jsonwebtoken');
const passport = require('passport');


/* user login. */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            let userData = { id:user._id , isadmin : user.isadmin, isverified: user.isverified, username:user.username }
            const token = jwt.sign(userData,'secret',{expiresIn: 60 * 60});

            return res.json({token});
        });
    })(req, res);

});

module.exports = router;