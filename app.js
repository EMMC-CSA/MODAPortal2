var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var session = require('express-session')
var passport = require('passport');



//CONFIG
var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(process.env.MODE == 'dev')
    app.use(logger('dev'));
else
    app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



// ROUTES
var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var modas = require('./routes/modas');

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/modas', modas);
app.use('/*', index);

// ERRORS
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    var errormsg = process.env.MODE == 'dev' ? String(err) : err.message;
    console.log(err);
    res.status(err.code || 500)
        .json({
            status: 'error',
            message: errormsg
        });
});


module.exports = app;