var express = require('express');
var router = express.Router();
let arg1 = "dog"
const spawn = require("child_process").spawn;


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
  })

 
  res.json('respond with a resource');
}); 

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
