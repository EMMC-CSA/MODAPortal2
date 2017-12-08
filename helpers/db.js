var dotenv = require('dotenv').config();
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = "";

if (process.env.MODE == 'dev') {
    connectionString = "postgres://localhost:5432/modadb";
} else {
    connectionString = "postgres://ubuntu:V008psql+@localhost:5432/modadb";
}

var db = pgp(connectionString);

module.exports = db;