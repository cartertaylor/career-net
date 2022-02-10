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

/* GET home page. */
router.post("/fetch_user_data", function (req, res, next) {
    console.log("Howdy");
    console.log(req.body);

    // Fetch top 10 users / names that match the search letters

    let searchLetters = req.body.searchLetters;
    console.log(searchLetters);

    // only query and send back data if we have actual information
    if (searchLetters != "") {
        // store the letters that were searched into variable to be checked against data base
        searchLetters = searchLetters + "%";

        // SELECT *(all) FROM (table) where
        sql = mysql.format("SELECT * FROM students WHERE first_name LIKE ? ", [
            searchLetters,
        ]);
        console.log(sql);

        connection.query(sql, function (err, result, fields) {
            if (err) throw err;

            console.log(result);

            let convertedData = convertStudentFormat(result); /// FIX TO BE ASYN FUNCTION

            let index = 0;

            rawData = result;

            stateValidObject = [];

            console.log("------SPACES------");
            // iterate over list of results
            for (index = 0; index < rawData.length; index++) {
                stateValidObject.push({
                    id: rawData[index].id,
                    firstName: rawData[index].first_name,
                    lastName: rawData[index].last_name,
                    newInfo: {
                        degree: rawData[index].degree,
                        workExperience: rawData[index].work_experience,
                        schoolYear: rawData[index].school_year,
                    },
                });
            }
            console.log("CHECK THIS OUT !!! ! ! ! ");
            console.log(stateValidObject);
            // send back the info
            // send response back
            res.json({
                status: "success",
                received: req.body,
                foundUsers: stateValidObject,
            });
        });
    }

    // No user found
    else {
        response.json({
            status: "success",
            received: request.body,
            foundUsers: false,
        });
    }

    // Return each users basic information
    for (let nameIndex in req.body) {
        console.log(req.body[nameIndex]);
        console.log("Reeeeee");
        // simulate pulls from database
        if (req.body[nameIndex].firstName == "Carter") {
            console.log(req.body[nameIndex].newInfo);
            // Set it equal to to the queried return
            req.body[nameIndex].newInfo = {
                major: "Applied Computer Science",
                jobExperience: ["Discover", "American Express"],
                schoolYear: "Senior",
            };
        }
        if (req.body[nameIndex].firstName == "bob") {
            req.body[nameIndex].newInfo = {
                major: "Engineer Science",
                jobExperience: ["Discover", "American Express"],
                schoolYear: "Senior",
            };
        }
    }

    console.log(req.body);
});

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

function convertStudentFormat(rawData) {
    console.log(rawData);

    let index = 0;

    stateValidObject = [];

    console.log("------SPACES------");
    // iterate over list of results
    for (index = 0; index < rawData.length; index++) {
        stateValidObject.push({
            firstName: rawData[index].first_name,
            lastName: rawData[index].last_name,
            newInfo: {
                degree: rawData[index].degree,
                workExperience: rawData[index].work_experience,
                schoolYear: rawData[index].school_year,
            },
        });
    }

    console.log(stateValidObject);
}
