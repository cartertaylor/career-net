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

// createMilestoneTable = 'CREATE TABLE milestones_test2 (milestone_id INT AUTO_INCREMENT PRIMARY KEY, student_id INT, FOREIGN KEY (student_id) REFERENCES students(id), milestone_type varchar(255), milestone_name varchar(255), milestone_job_title varchar(255), date_start DATE, date_end DATE)'
// createMilestoneTable = "SELECT * from milestones_test2"
// connection.query(createMilestoneTable, function (err, result) {
//     if (err) throw err;
//     console.log( result);
//   });

// generates dynamic user page using ejs template
router.get("/student_profile/:student", (request, response, next) => {
    // store username searched
    stringedName = request.params.username;
    console.log("diggity dog");

    // look for existing username in database( select the data)
    var sql = mysql.format("SELECT * FROM ?? WHERE userName=?", [
        userTable,
        stringedName,
    ]);

    
});

module.exports = router;
