var passport = require('passport');
var db = require('../helpers/db');

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.one('SELECT * FROM users WHERE id = $1', [id])
            .then(function(user) {
                return done(null, user);
            })
            .catch(function(error) {
                return done(error, null);;
            });
    });

};