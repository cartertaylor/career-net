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


/* GET students who have had an internship */
router.post('/filter', authenticate.verifyToken, function(req, res, next) {
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

    // SQL query to receive optional filter parameters for graph
    sql = mysql.format("SELECT COUNT(DISTINCT ??.student_id) FROM ?? LEFT JOIN ?? ON ??.student_id = ??.student_id WHERE degree = ? AND milestone_type = 'Internship' AND grad_year >= IF( ? IS NOT NULL,?, 2010 ) AND grad_year <= IF( ? IS NOT NULL,?, ? ) LIMIT 10", [
    studentsTable, studentsTable, milestonesTable, milestonesTable, studentsTable, groupName, startYearRange, startYearRange, endYearRange,endYearRange, fourYearsDate]);

    console.log(sql)

    connection.query(sql, function(err, result)
    {   
        if (err)
        {
            res.json({status:"Failure"})
        }
        if(result.length > 0)
        {
            console.log(result)

            // Retreive count of students matching the filter
            let studentTotal = Object.values(result[0])[0]

            // Send back total retreived
            res.json(
                {
                    status:"Success",
                    studentTotal:studentTotal
                }
            )
        }
        else
        {
            // If we received nothing for that filter, assume that the total is 0
            res.json(
                {
                    status:"Success",
                    studentTotal:0
                }
            )
        }
            
    })

});


/* GET students who have had an internship */
router.post('/newGroup', authenticate.verifyToken, function(req, res, next) {
    console.log("connected to newGroup finder")
    console.log(req.body)


    // res.json(
    //     {
    //         status:"Success",
    //         studentTotal:req.body
    //     }
    // )

    // Grab group variables from req.body sent over from front end
    let groupName = req.body.group.groupName;
    let startYearRange = new Date(req.body.group.groupYearRange.startDate, 0);
    let endYearRange =  new Date(req.body.group.groupYearRange.endDate, 11);

    console.log(startYearRange)


    // Grab the end range year dynamically 
    const date = new Date();
    let fourYearsFromNow = date.getFullYear() + 4;
    let fourYearsDate = new Date(fourYearsFromNow, 4)

    // SQL query to receive optional filter parameters for graph
    sql = mysql.format("SELECT COUNT(DISTINCT ??.student_id) FROM ?? WHERE degree = ? AND grad_year >= IF( ? IS NOT NULL,?, 2010 ) AND grad_year <= IF( ? IS NOT NULL,?, ? ) LIMIT 10", [
    studentsTable, studentsTable, groupName, startYearRange, startYearRange, endYearRange,endYearRange, fourYearsDate]);

    console.log(sql)

    connection.query(sql, function(err, result)
    {   


        console.log("Lets go godzilla")
        console.log(result)

        if (err)
        {
            res.json({status:"Failure"})
        }
        if(result.length > 0)
        {
            console.log(result)

            // Retreive count of students matching the filter
            let studentTotal = Object.values(result[0])[0]
            
            // Send back total retreived
            res.json(
                {
                    status:"Success",
                    studentTotal:studentTotal
                }
            )
        }
        else
        {
            // If we received nothing for that filter, assume that the total is 0
            res.json(
                {
                    status:"Success",
                    studentTotal:0
                }
            )
        }
            
    })

});



module.exports = router;
