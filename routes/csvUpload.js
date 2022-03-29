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

router.post('/newStudents', authenticate.verifyToken, authenticate.retreivePermissions,function(req, res, next) {

    // Get ID of user created this new user from authentication (req.userId) 
    let createdByUserId = req.userId;
    const todaysDate = new Date();

    // Get permissions validated for user by middleware
    console.log("riggity wrecked")
    console.log(req.userPermissions )
    let currentUserPermissions = req.userPermissions;

    console.log("Receiving CSV upload for new students")
    console.log(req.body.data)
    let sql = mysql.format("SELECT * FROM users2");

    let csvRows = req.body.data

    let validRow;
    let arrayOfInvalidRows = []

    // Iterate over each row in CSV
    csvRows.forEach(row => {
        validRow = true;
        // check each row for a value
        for (col in row)
                {
                    // Remove extra white space
                    row[col] = row[col].trim()
                    
                    if (!checkValidString(row[col]))
                    {   
                        validRow = false;
                        arrayOfInvalidRows.push(row.nau_id)
                    }

                }
    
        // Only input student if valid row and if the student to uploaded matches the users permission
        if (validRow & currentUserPermissions.includes(row.degree) == 1)
        {
            console.log("THIS STUDENT MADE IT THROUGH")
            if (row.nau_id.includes("@"))
            {
                row.nau_id = row.nau_id.split("@")[0]
            }

            let gradeDate = getGradeDate(row.graduation_year)
            console.log(gradeDate)
            console.log(todaysDate)

            sql = mysql.format("INSERT IGNORE INTO ?? (student_id, first_name, last_name, degree, grad_year, date_created, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [studentsTable,row.nau_id, row.first_name, row.last_name, row.degree, gradeDate, todaysDate, createdByUserId]);

            console.log(sql)

            connection.query(sql, function (err, result)
                {   if (err) throw err;
                    
                    // console.log(result)
                    
                })
        }

        // Check that major is in list supported by current user
        else{
            arrayOfInvalidRows.push(row.nau_id)
        }
        
    })

    res.json(
        {
            status:"Success",
            message: "The data was uploaded",
            invalidRows:arrayOfInvalidRows
        }
    )
    
});

router.post ('/newMilestones',authenticate.verifyToken, authenticate.retreivePermissions, function(req, res) {
    console.log("Receiving CSV upload New milestones")
    console.log(req.body)

    // Get ID of user created this new user from authentication (req.userId) 
    let createdByUserId = req.userId;

    // Get permissions validated for user by middleware
    console.log("riggity wrecked");
    console.log(req.userPermissions);
    let currentUserPermissions = req.userPermissions;

    console.log(currentUserPermissions)

    console.log("Receiving CSV upload for new students");
    console.log(req.body.data);
    let sql = mysql.format("SELECT * FROM users2");

    let csvRows = req.body.data;

    // Array holds the current selected students milestones to be added
    let studentMilestoneArray = []

    let validRow;
    let arrayOfInvalidRows = [];
    console.log(!csvRows.length < 1)
        
    if (!csvRows.length < 1)
    {
        console.log("HEY THERE")
        // Select initial pointer for the student we are gathering milestones for
        let currentlySelectedStudent = csvRows[0]

        // Iterate over each row in CSV
        csvRows.forEach((row, index )=> {

            if (row.nau_id.includes("@"))
            {
                row.nau_id = row.nau_id.split("@")[0]
            }

            validRow = true;
            nextRow = csvRows[index + 1]

            // Save the user of each column 

            // check each column for a value
            for (col in row)
            {

                // Remove extra white space
                row[col] = row[col].trim()


            }

            let milestoneSuccess = undefined
            
            // Check for school milestone "school name"
                // if good, create a milestone array inserstion variable using the column values
            milestoneSuccess = retreiveMilestone(row, "school", studentMilestoneArray)

            if (milestoneSuccess.properMilestone) 
            {
                // Insert the created milestone array into the students global array
                studentMilestoneArray.push(milestoneSuccess.insertRow)
            }
            // Add the student to not inserted
            else
            {
                console.log("not Valid new milestone")
                arrayOfInvalidRows.push(row.nau_id)
            }   

            // Check for milestone "job title"
                // if good, create a milestone array inserstion variable using the column values 
            milestoneSuccess = retreiveMilestone(row, "normal", studentMilestoneArray)

            if (milestoneSuccess.properMilestone)
            {
                // Insert the created milestone array into the students global array
                studentMilestoneArray.push(milestoneSuccess.insertRow)
            }
            // Add the student to not inserted
            else
            {
                console.log("not Valid new milestone")
                arrayOfInvalidRows.push(row.nau_id)
            }

            // We have reached the end of tis given user, collect the value of the current row index,
            if (nextRow == undefined || currentlySelectedStudent.nau_id != nextRow.nau_id )
            {   

                console.log("Printing out master student milestone list")

                console.log(studentMilestoneArray)

                // Create insert ready variable
                let values = studentMilestoneArray


                // Take the milestone array data and create a SQL query
                let sql = mysql.format( "INSERT IGNORE INTO ?? (student_id , milestone_type, milestone_name, milestone_job_title, milestone_description, milestone_location ,date_start, date_end, last_updated) VALUES ?", [milestonesTable])

                console.log(sql)
                // Insert each milestones for given student
                try{
                    connection.query(sql, [values] , function (err, result)
                    {   if (err) throw err;
                        
                        console.log(result) 
                        
                    })
                }
                catch{
                    console.log("Error inserting new milestones")
                }

                // Iterate to next student since we finished this one
                currentlySelectedStudent = nextRow
                
                // Reset the milestone array to empty for the next student
                studentMilestoneArray = []
            }

            if (currentlySelectedStudent == undefined)
            {
                res.json(
                    {
                        status:"Success",
                        message: "The data was uploaded",
                        invalidRows:arrayOfInvalidRows
                    }
                )
            }
            
            
        })

    }

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

// Functions receives CSV row and returns 
// returns Object
    // properMilestone: true/false
    // insertRow: an array with the properly configured milestone values
// Parameters
    // milestoneRow: contains the columns of the milestone
    // typeOfMilestone:"normal" or "school"
    // studentMilestoneArray: array of the current miletones to be added for student
function retreiveMilestone(studentRow, typeOfMilestone, studentMilestoneArray)
{   

    // Variable to hold the individual milestones parameteres
    let milestone = []
    
    const todaysDate = new Date();

    if (typeOfMilestone == "school")
    {
        if (checkValidString(studentRow.school_name) & checkValidString(studentRow.nau_id))
        {
        // indvidualMilestoneTuple = (studentTableId, milestoneType, schoolName, degree, milestoneDescription, dateStart, dateEnd , currentDate)

            milestone = [studentRow.nau_id, "Education" ,studentRow.school_name, studentRow.area_of_study, studentRow.degree_type, studentRow.education_location, studentRow.education_start_date, studentRow.education_end_date, todaysDate]
            
            return {properMilestone:true, insertRow:milestone}  
        }
    }
    else if (typeOfMilestone == "normal")
    {
        if (checkValidString(studentRow.milestone_employer) & checkValidString(studentRow.nau_id))
        {   
            // indvidualMilestoneTuple = (studentTableId, milestoneType, schoolName, degree, milestoneDescription, dateStart, dateEnd , currentDate)

            milestone = [studentRow.nau_id, "Full Time Job", studentRow.milestone_employer, studentRow.job_title, studentRow.milestone_description, studentRow.milestone_location,studentRow.milestone_start_date, studentRow.milestone_end_date,todaysDate]

            return {properMilestone:true, insertRow:milestone}            
        }
    }
    
    // Otherwise return false
    return {properMilestone:false, insertRow:undefined}
    
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
