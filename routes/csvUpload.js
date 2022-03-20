var express = require('express');
var router = express.Router();

// Import Mysql
const connection = require("../database/db")
const mysql = require('mysql');

// Middleware
const authenticate = require("../middleware/authenticate") 

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("Receiving CSV upload OG")
    console.log(req.body)

    // Send response depending on CSV upload success
    res.json(
        {
            status:"Success",
            message: "The data was uploaded"
        }
    )

});

router.post('/newStudents', authenticate.verifyToken, function(req, res, next) {

    // Get ID of user created this new user from authentication (req.userId) 
    let createdByUserId = req.userId;
    const todaysDate = new Date();

    console.log("Receiving CSV upload for new students")
    console.log(req.body.data)
    let sql = mysql.format("SELECT * FROM users2");

    let csvRows = req.body.data

    let validRow;
    let arrayOfInvalidRows = []



    // Iterate over each row in CSV
    csvRows.forEach(row =>{
        validRow = true;
        // check each row for a value
        for (col in row)
                {

                    if (!checkValidString(row[col]))
                    {
                        validRow = false;
                        arrayOfInvalidRows.push(row.nau_id)
                    }

                }
            
        

        // Only input student if valid row 
        console.log(arrayOfInvalidRows)
        if (validRow)
        {

            row.nau_id = row.nau_id.split("@")[0]
            let gradeDate = getGradeDate(row.graduation_year)
            console.log(gradeDate)
            console.log(todaysDate)

            sql = mysql.format("INSERT IGNORE INTO students8 (student_id, first_name, last_name, degree, grad_year, date_created, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [row.nau_id, row.first_name, row.last_name, row.degree, gradeDate, todaysDate, createdByUserId]);

            console.log(sql)
        }

        // Check that major is in list supported by current user
        
        connection.query(sql, function (err, result)
        {   if (err) throw err;
            
            console.log(result)

            
            
        })
    })

    res.json(
        {
            status:"Success",
            message: "The data was uploaded",
            invalidRows:arrayOfInvalidRows
        }
    )
    

    

});

router.post ('/newMilestones', function(req, res, next) {
    console.log("Receiving CSV upload New milestones")
    console.log(req.body)

    sql = mysql.format("SELECT * FROM students WHERE first_name LIKE ? AND ((?) IS NULL OR degree in (?)) AND school_year >= IF( ? IS NOT NULL,?, 2010 ) AND school_year <= IF( ? IS NOT NULL,?, ? ) LIMIT 10", [
        searchLetters, joinedMajorFilters, filteredMajors, startYearRange, startYearRange, endYearRange,endYearRange, fourYearsFromNow
    ]);


    // Send response depending on CSV upload success
    res.json(
        {
            status:"Success",
            message: "The data was uploaded"
        }
    )

});

function checkValidString(string)
{
    // Check to make sure string is not empty
    if (string != "" && string != null && string != undefined)
    {
        return true;
    }

    // Otherwise return false
    return false

}

function getGradeDate(gradString)
{
    let seasons = ["Summer", "Fall", "Winter" , "Spring"]
    let splitString = gradString.split(" ")
    let splitYear = splitString[0]
    let splitSeason = splitString[1]
   
    let monthIndex = 4;
    let year = 2022;
    
    if (gradString == "Fall" || gradString == "Winter")
    {
        monthIndex = 11
    }
    

    let gradDate = new Date(year, monthIndex, 7)

    return gradDate;
    
}

module.exports = router;
