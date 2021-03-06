var express = require('express');
var router = express.Router();
let arg1 = "dog123"
const spawn = require("child_process").spawn;

// Middleware
const authenticate = require("../middleware/authenticate") 

const mysql = require('mysql');
// Instanstiate database
const connection = require("../database/db")


// ENV variables
const milestoneTable = process.env.MILESTONE_TABLE;
const studentsTable = process.env.STUDENTS_TABLE;


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("YO YO YO")
  res.json('respond with a resource');
});

// Route to fetch data of existing stored Student data
router.post('/get_linkedin_data', authenticate.verifyToken, authenticate.retreivePermissions,  async function(req, res, next) {
  console.log(req.body)
  console.log(req.body.selectedFilters.lastTimeUpdatedRange)
  console.log("YO YO YO 2")

  // Grab variables for current user from middleware 
  let currentUserId = req.userId
  let userAvailablePermissions = req.userPermissions


  // -- Grab values from post request --

  // Figure out if user only wants to update students added by them 
  let fetchOnlyUserAddedData = req.body.selectedFilters.fetchOnlyUserAddedData

  // Grab Values for the dates the student was created
  let startDateCreatedRange = null
  let endDateCreatedRange = null
  if (Object.keys( req.body.selectedFilters.lastTimeUpdatedRange).length != 0 ) 
  {
    startDateCreatedRange = req.body.selectedFilters.lastTimeUpdatedRange[0].startDate
    endDateCreatedRange = req.body.selectedFilters.lastTimeUpdatedRange[0].endDate
  }


  // Grab graduation date ranges filter
  let startGradYearRange = new Date(req.body.selectedFilters.gradDateRanges.startDate, 0);
  let endYearGradRange =  new Date(req.body.selectedFilters.gradDateRanges.endDate, 11);


   // Grab the end range year dynamically 
  const date = new Date();
  let fourYearsFromNow = date.getFullYear() + 4;
  let fourYearsDate = new Date(fourYearsFromNow, 4)

  // Grab major Filters
  let filteredMajors = req.body.selectedFilters.filteredMajors

  // If we receive an empty array, it should be assumed as NULL
  if (filteredMajors < 1)
  {
      filteredMajors = null
  }
  // Make sure that filtered majors has values in it
  let joinedMajorFilters = null
  if (filteredMajors != null)
  {
      joinedMajorFilters = filteredMajors.join(",")
  }

  // Create SQL query to send to python script 
  let sql = mysql.format ( "SELECT * FROM ?? WHERE ((?) is false OR created_by_user_id = ?) AND ((?) IS NULL OR  degree IN (?)) AND grad_year >= IF( ? IS NOT NULL,?, 2010 ) AND grad_year <= IF( ? IS NOT NULL,?, ? ) AND date_created >= IF( ? IS NOT NULL,?, 2010 ) AND date_created <= IF( ? IS NOT NULL,?, ? ) AND degree in (?)",
    [studentsTable,fetchOnlyUserAddedData, currentUserId, joinedMajorFilters, filteredMajors ,startGradYearRange, startGradYearRange, endYearGradRange,endYearGradRange, fourYearsDate, startDateCreatedRange, startDateCreatedRange, endDateCreatedRange, endDateCreatedRange, fourYearsDate, userAvailablePermissions])
  
  
  // const dataFromPython = await pythonPromise();
  // console.log(dataFromPython)

  // Call Python Script
  const python = spawn('python3', ["./pythonScripts/LinkedinFetcher.py", JSON.stringify({message:"Requesting Linkedin Milestone data", sqlQuery:sql})]);
  python.stdout.on("data", (data) => {
    console.log("Bro whats up")
    console.log(data.toString())
  });

  python.stderr.on("data", (data) => {
    console.error(`stdrr: ${data}`)
  });

  python.on('exit',(code) =>
  {
    console.log("exiting guy ")
    console.log(code)
    res.json({note:'respond with a resource: 0 means good, anything else means error', linkedinFetchStatus: code});
  })

  
}); 


// Route to retreive student milestones based on student profile ID
router.post('/get_student_milestones', async function(req, res, next) {
  console.log(req.body)
  console.log("YO YO YO 333333")
  
  studentId = req.body.studentInfo.id

  // QUERY to grab each milestone given the studetns id
  sql = mysql.format( "SELECT * from ?? WHERE student_id = ?", [milestoneTable,studentId])  

  console.log(sql)

  connection.query (
      sql, function (err, result, fields)
      {
        
        console.log(result)
        res.json({status:"success", studentMilestones:result})
      }
    );

    
  
}); 


/* POST Student Data*/
router.post("/search", authenticate.verifyToken,function (req, res, next) {

  // Grab Id of user searching for students
  let createdByUserId = req.userId;

  console.log("Howdy");
  console.log(createdByUserId)
  console.log(req.body);


  // Grab Filter Data TODO: Add date / year to be filtered
  let searchLetters = req.body.searchedLetters;
  let filteredMajors = req.body.filteredMajors;
  let startYearRange = new Date(req.body.dateRanges.startDate, 0);
  let endYearRange =  new Date(req.body.dateRanges.endDate, 11);

  // Grab the end range year dynamically 
  const date = new Date();
  let fourYearsFromNow = date.getFullYear() + 4;
  let fourYearsDate = new Date(fourYearsFromNow, 4)

  console.log(fourYearsDate)
  console.log(endYearRange)
  console.log(startYearRange)
  

  // If we receive an empty array, it should be assumed as NULL
  if (filteredMajors < 1)
  {
      filteredMajors = null
  }

  // Make sure that filtered majors has values in it
  let joinedMajorFilters = null
  if (filteredMajors != null)
  {
      joinedMajorFilters = filteredMajors.join(",")
  }

  // only query and send back data if we have actual information
  if (1 ==1) {
      // store the letters that were searched into variable to be checked against data base
      if (searchLetters != "" & searchLetters != null)
      {
        searchLetters = searchLetters + "%";
      }
      // If the user doesnt pass in a key word search, we want to grab everything we can 
      else
      {
        searchLetters = "%%"
      }

      // SQL query to receive optional filter parameters
      sql = mysql.format("SELECT * FROM ?? WHERE first_name LIKE ? AND ((?) IS NULL OR degree in (?)) AND grad_year >= IF( ? IS NOT NULL,?, 2010 ) AND grad_year <= IF( ? IS NOT NULL,?, ? ) LIMIT 100", [
          studentsTable, searchLetters, joinedMajorFilters, filteredMajors, startYearRange, startYearRange, endYearRange,endYearRange, fourYearsDate
      ]);

      console.log(sql)

      connection.query(sql, function (err, result, fields) {
          if (err) throw err;

          console.log(result);

          let index = 0;

          rawData = result;

          let studentGradYear = 2022
          stateValidObject = [];
          if (result.length >0)  
          {
            console.log("the result had length")
            
            console.log("------SPACES------");
            // iterate over list of results
            for (index = 0; index < rawData.length; index++) {
              
              let studentGradYear = (rawData[index].grad_year + "")
              console.log(studentGradYear)
              studentGradYear = studentGradYear.split(" ")[1] + " " + studentGradYear.split(" ")[3]

              
                stateValidObject.push({
                    id: rawData[index].student_id,
                    firstName: rawData[index].first_name,
                    lastName: rawData[index].last_name,
                    newInfo: {
                        degree: rawData[index].degree,
                        workExperience: rawData[index].work_experience,
                        schoolYear: studentGradYear,
                    },
                });
            }
          }
          console.log("CHECK THIS OUT !!! ! ! ! ");
          console.log(stateValidObject);

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
          status: "failure",
          received: request.body,
          foundUsers: false,
      });
  }

  console.log(req.body);

});


// -- HELPER FUNCTIONS

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

// grab python data in a promise
const pythonPromise  = () => {
  try{
      return new Promise((resolve, reject) => {
        const python = spawn('python3', ["testPrint.py", arg1], {cwd: __dirname});
        python.stdout.on("data", (data) => {
          resolve(data.toString());
        });

        python.stderr.on("data", (data) => {
          reject(data.toString());
        });
    });
  }
  catch(err)
  {
    console.log("Error found")
    console.log(err)
  }
};

module.exports = router;
