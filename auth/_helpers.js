var bcrypt = require('bcryptjs');

function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}

function loginRequired(req, res, next) {
    if (!req.user) return res.status(401).json({
        status: 'error',
        message: 'please log in'
    });
    return next();
}

function loginRedirect(req, res, next) {
    if (req.user) return res.status(401).json({
        status: 'error',
        message: 'already logged in'
    });
    return next();
}


module.exports = {
    comparePass,
    loginRequired,
    loginRedirect
};