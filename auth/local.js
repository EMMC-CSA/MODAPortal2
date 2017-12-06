var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var init = require('./passport');
var db = require('../helpers/db');
var authHelpers = require('./_helpers');

const options = {};

init();


passport.use(new LocalStrategy(options, (username, password, done) => {
    db.one('SELECT * FROM users WHERE email = $1', [username])
        .then(function(user) {
            if (!user) {
                return done(null, false, { statuscode: 404, status: 'error', message: 'incorrect email' });
            }
            if (!authHelpers.comparePass(password, user.password)) {
                return done(null, false, { statuscode: 403, status: 'error', message: 'incorrect password' });
            } else {
                return done(null, user);
            }
        })
        .catch(function(error) {
            return done(error);
        });
}));

module.exports = passport;