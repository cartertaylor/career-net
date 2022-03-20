var express = require("express");
var router = express.Router();
const mysql = require("mysql");

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
        host: "localhost",
        port: 3306,
        user: "root",
        password: "polpol11",
        database: "mysql",
    },
    "pool"
);

module.exports = connection;