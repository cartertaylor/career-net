var express = require('express');
var router = express.Router();

// Import Mysql
const connection = require("../database/db")
const mysql = require('mysql');

// Middleware
const authenticate = require("../middleware/authenticate") 

// ENV variables
const studentsTable = process.env.STUDENTS_TABLE;
const milestonesTable = process.env.MILESTONE_TABLE;


/* GET home page. */
router.post('/internshipFilter', authenticate.verifyToken, function(req, res, next) {
    console.log("connected to internship filter")
    console.log(req.body)

    // Grab group variables from req.body sent over from front end
    let groupName = req.body.group.groupName;
    let startYearRange = new Date(req.body.group.groupYearRange.startDate, 0);
    let endYearRange =  new Date(req.body.group.groupYearRange.endDate, 11);

    console.log(startYearRange)


    // Grab the end range year dynamically 
    const date = new Date();
    let fourYearsFromNow = date.getFullYear() + 4;
    let fourYearsDate = new Date(fourYearsFromNow, 4)

        // SQL query to receive optional filter parameters
        sql = mysql.format("SELECT COUNT(??.student_id) FROM ?? WHERE degree = ? AND grad_year >= IF( ? IS NOT NULL,?, 2010 ) AND grad_year <= IF( ? IS NOT NULL,?, ? ) LIMIT 10", [
        studentsTable, studentsTable, groupName, startYearRange, startYearRange, endYearRange,endYearRange, fourYearsDate

        // Left
    ]);
    
    console.log(sql)

    connection.query(sql, function(err, result)
    {
        console.log(result)
    })

    res.json({
        status:"Success"
    })
});



module.exports = router;
