var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var db = require('../helpers/db');

var authHelpers = require('../auth/_helpers');

router.get('/', authHelpers.loginRequired, (req, res, next) => {
    db.any('SELECT * FROM users ORDER BY name desc')
    .then(function(data) {
        res.status(200)
        .json({
            status: 'success',
            data: data
        });
    })
    .catch(function(err) {
        handleErrResponse(res, 400, err.message);
    });
});


router.get('/:id(\\d+)', authHelpers.loginRequired, (req, res, next) => {
    var userid = parseInt(req.params.id);
    var loggeduserid = parseInt(req.user.id);
    if (userid == loggeduserid) {
        db.one('SELECT id, name, email, org_name, country, role FROM users WHERE deleted = false AND id = $1', userid)
        .then(function(data) {
            res.status(200)
            .json({
                status: 'success',
                data: data
            });
        })
        .catch(function(err) {
            handleErrResponse(res, 400, err.message);
        });
    } else {
        handleErrResponse(res, 401, 'unauthorized');
    }
});

router.get('/:email', (req, res, next) => {
    db.one('SELECT id, name, email, org_name, country, role FROM users WHERE deleted = false AND email = $1', req.params.email)
    .then(function(data) {
        res.status(409)
        .json({
            status: 'success',
            data: data
        });
    })
    .catch(function(err) {
        handleErrResponse(res, 400, err.message);
    });

});


router.delete('/:id', authHelpers.loginRequired, (req, res, next) => {
    var userid = parseInt(req.params.id);
    var loggeduserid = parseInt(req.user.id);
    if (userid == loggeduserid) {
        db.none('UPDATE users SET deleted = true WHERE id = $1', userid)
        .then(function(data) {
            res.status(200)
            .json({
                status: 'success',
                data: 'user deleted'
            });
        })
        .catch(function(err) {
            handleErrResponse(res, 400, err.message);
        });
    } else {
        handleErrResponse(res, 401, 'unauthorized');
    }
});

router.put('/:id', authHelpers.loginRequired, (req, res, next) => {
    var userid = parseInt(req.params.id);
    var loggeduserid = parseInt(req.user.id);
    if (userid == loggeduserid) {
        if (req.body.password) {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(req.body.password, salt);
            db.one('UPDATE users SET name=$1, email=$2, org_name=$3, country=$4, role=$5, password=$6 WHERE id = $7 RETURNING id, name, email, org_name, country, role', [req.body.name, req.body.email, req.body.org_name, req.body.country, req.body.role, hash, userid])
            .then(function(data) {
                res.status(200)
                .json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function(err) {
                handleErrResponse(res, 400, err.message);
            });
        } else {
            db.one('UPDATE users SET name=$1, email=$2, org_name=$3, country=$4, role=$5 WHERE id = $6 RETURNING id, name, email, org_name, country, role', [req.body.name, req.body.email, req.body.org_name, req.body.country, req.body.role, userid])
            .then(function(data) {
                res.status(200)
                .json({
                    status: 'success',
                    data: data
                });
            })
            .catch(function(err) {
                handleErrResponse(res, 400, err.message);
            });
        }

    } else {
        handleErrResponse(res, 401, 'unauthorized');
    }
});

function handleErrResponse(res, code, msg) {
    res.status(code).json({ status: 'error', message: msg });
}

module.exports = router;