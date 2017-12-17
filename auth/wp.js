var passport = require('passport');
var WordpressStrategy = require('passport-wordpress').Strategy;
var db = require('../helpers/db');
var init = require('./passport');

init();


passport.use(new WordpressStrategy({
	clientID: '56475',
	clientSecret: 'De40VHSE8ctO8mLjGAIDXvjiROMKM2BjNnU1JnScBQP4Y6SX2Vx53uMXa09V9BZv',
	callbackURL: '/api/auth/wordpress/callback'
},function(accessToken, refreshToken, user, done) {
	user = user._json;
	db.one('SELECT * FROM users WHERE email = $1', [user.email])
	.then(function(localuser) {
		return done(null, localuser);
	})
	.catch(function(error) {
		if(error.message == "No data returned from the query."){
			var datenow = Date.now() / 1000;
			console.log(datenow);
			db.one("INSERT INTO users(name, email, password, country, date_added) VALUES($1, $2, $3, $4, to_timestamp($5)) RETURNING email", [user.display_name, user.email, accessToken, user.user_ip_country_code, datenow])
			.then(function(newuser) {
				return done(null, newuser);
			})
			.catch(function(err) {
				return done(err, null);
			});

		} else {
			return done(error, null);
		}
	});
}));

module.exports = passport;