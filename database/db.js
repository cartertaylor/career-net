var express = require("express");
var router = express.Router();
const mysql = require("mysql");

// ENV variables
const userTable = process.env.USER_TABLE;
const databaseHost = process.env.DATABASE_HOST;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;


// SQL
let studentCols = [
    "first_name",
    "last_name",
    "degree",
    "work_experience",
    "school_year",
];

// Instanstiate database
var connection = mysql.createConnection(
    {
        host: databaseHost,
        port: 3306,
        user: databaseUser,
        password: databasePassword,
        database: databaseName,
    },
    "pool"
);


module.exports = connection;