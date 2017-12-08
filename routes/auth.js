var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var db = require('../helpers/db');
var authHelpers = require('../auth/_helpers');
var passport = require('../auth/local');

router.post('/register', (req, res, next) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    var datenow = Date.now() / 1000;
    db.one("INSERT INTO users(name, email, password, org_name, country, date_added) VALUES($1, $2, $3, $4, $5, to_timestamp($6)) RETURNING email", [req.body.name, req.body.email, hash, req.body.org_name, req.body.country, datenow])
    .then(function(user) {
        res.status(201).json({
            status: 'success',
            message: 'user created',
            data: user
        });
    })
    .catch(function(err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    });
    
});

router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            handleErrResponse(res, err.message == "No data returned from the query." ? 404 : 500, err.message);
        }
        if (user) {
            req.logIn(user, function(err) {
                if (err) {
                    handleErrResponse(res, 401, 'failed to login');
                } else if (user.deleted) {
                    db.none('UPDATE users SET deleted = false where id = $1', user.id)
                    .then(function() {
                        delete user.password;
                        res.status(200)
                        .json({
                            status: 'success',
                            data: user
                        });
                    })
                    .catch(function(err) {
                        handleErrResponse(res, 400, err.message);
                    });
                } else {
                    delete user.password;
                    res.status(200)
                    .json({
                        status: 'success',
                        data: user
                    });
                }
            });
        }
    })(req, res, next);
});

router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
    req.logout();
    res.status(200)
    .json({
        status: 'success',
        message: 'logged out'
    });
});

router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            status: false
        });
    } else {
        res.status(200).json({
            status: true,
            data: req.user.id
        });
    }
});


router.post('/forgotpass', function(req, res) {
    crypto.randomBytes(48, function(err, buffer) {
        if (err) { handleErrResponse(res, 500, 'something went wrong with crypto'); }
        var token = buffer.toString('hex').substring(0, 8);
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(token, salt);
        db.none('UPDATE users SET password = $1 WHERE email = $2', [hash, req.body.email])
        .then(function(data) {
            res.status(200)
            .json({
                status: 'success'
            });
        })
        .catch(function(err) {
            handleErrResponse(res, 400, err.message);
        });
    });
});

function handleErrResponse(res, code, msg) {
    res.status(code).json({ status: 'error', message: msg });
}

function capitalize(string) {
    var str = string.toLowerCase();
    if (str.indexOf(' ') > 0)
        str = str.substring(0, str.indexOf(' '));
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = router;