var express = require('express');
var router = express.Router();
let arg1 = "dog"
const spawn = require("child_process").spawn;


const mysql = require('mysql');


// SQL 
let studentCols = ( ['first_name', 'last_name', 'degree', 'work_experience', 'school_year'] );

// Instanstiate database
var connection = mysql.createConnection({
host: 'localhost',
port: 3306,
user : 'root',
password:'polpol11',
database:'mysql'
}, 'pool');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("YO YO YO")
  res.json('respond with a resource');
});

// Route to fetch data of existing stored Student data
router.post('/get_linkedin_data', async function(req, res, next) {
  console.log(req.body)
  console.log("YO YO YO 2")
  
  // Call Python Script
  // const dataFromPython = await pythonPromise();
  // console.log(dataFromPython)

  const python = spawn('python3', ["./pythonScripts/testPrint.py", arg1]);
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
  sql = mysql.format( "SELECT * from milestones_test4 WHERE student_id = ?", [studentId])  

  console.log(sql)

  connection.query (
      sql, function (err, result, fields)
      {
        
        console.log(result)
        res.json({status:"success", studentMilestones:result})
      }
    );

    
  
}); 


// POST TO ADD USER INFORMATßION TO DATABASE
router.post('/add_student', function (req, res) 
{   
    valuesBeingAdded = [];

    // store all the values in an array
    valuesBeingAdded.push(req.body.firstName);
    valuesBeingAdded.push(req.body.lastName);
    valuesBeingAdded.push(req.body.newInfo.degree);
    valuesBeingAdded.push(req.body.newInfo.experience);
    valuesBeingAdded.push(req.body.newInfo.schoolYear);

    // create query to store into the columns with the values provided 
    let sql = mysql.format("INSERT INTO students (??) VALUES (?)", [studentCols, valuesBeingAdded]);
    


    console.log("We are tryinfg to add student information now");
    console.log(valuesBeingAdded);
    console.log(req.body)
    console.log(sql)

    let response = {userAdded:false, message: "User could not be added"}

    connection.query(sql, function (err, result) {
        // if error received, report failure to add user
        if (err) 
        {
            throw err;


        }
        // otherwise report success
        else 
        {
            console.log("Inserted Student");
            console.log(result);
            response = {userAdded:true, message: "User " + req.body.firstName + " " +req.body.lastName + " was successfully added"}
        }         
    
        // send back response
        res.json(response)
        
      });
    

})

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
