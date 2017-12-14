var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var multer = require('multer');
var authHelpers = require('../auth/_helpers');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post('/', authHelpers.loginRequired, upload.single('file'), (req, res, next) => {
    var datenow = Date.now() / 1000;
    // var filepath = req.file ? req.file.path : null;
    db.one("INSERT INTO modas(user_id, date_added, data) VALUES($1, to_timestamp($2), $3) RETURNING id", [parseInt(req.user.id), datenow, req.body.modajson])
    .then(function(data) {
        res.status(201).json({
            status: 'success',
            message: 'moda created',
            data: data
        });
    })
    .catch(function(err) {
        handleErrResponse(res, 400, err.message);
    });
});

router.get('/usermodas/:offset(\\d+)', authHelpers.loginRequired, (req, res, next) => {
    db.any('SELECT * FROM modas WHERE user_id=$1 ORDER BY date_added desc, deleted desc LIMIT 20 OFFSET $2', [parseInt(req.user.id), parseInt(req.params.offset)])
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


router.get('/all/:offset(\\d+)', authHelpers.loginRequired, (req, res, next) => {
    // check if user is admin
    db.any('SELECT * FROM modas WHERE user_id=$1 ORDER BY date_added desc LIMIT 20 OFFSET $2', [parseInt(req.user.id), parseInt(req.params.offset)])
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

router.get('/:id(\\d+)', (req, res, next) => {
    db.one('SELECT * FROM modas WHERE id = $1', parseInt(req.params.id))
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


router.delete('/:id', authHelpers.loginRequired, (req, res, next) => {
    db.none('UPDATE modas SET deleted = true WHERE user_id=$1 AND id = $2', [parseInt(req.user.id), parseInt(req.params.id)])
    .then(function(data) {
        res.status(200)
        .json({
            status: 'success',
            data: 'moda deleted'
        });
    })
    .catch(function(err) {
        handleErrResponse(res, 400, err.message);
    });
});

router.post('/:id', authHelpers.loginRequired, upload.single('file'), (req, res, next) => {
    if (req.body.oldfilepath) {
        fs.unlink(req.body.oldfilepath, function(error) {
            if (error) {
                console.log(error);
            }
        });
    }
    if (req.file)
        filepath = req.file.path;
    else
        filepath = req.body.filepath;
    db.one('UPDATE modas SET data=$1 WHERE user_id=$2 AND id=$3 RETURNING *', [req.body.modajson, parseInt(req.user.id), parseInt(req.params.id)])
    .then(function(data) {
        res.status(200)
        .json({
            status: 'success',
            data: data
        });
    })
    .catch(function(err) {
        handleErrResponse(res, 500, err.message);
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