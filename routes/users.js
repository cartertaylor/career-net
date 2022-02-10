var express = require('express');
var router = express.Router();
const mysql = require('mysql');

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

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("Receiving CSV upload")
    console.log(req.body)

    
    

    // Send response depending on CSV upload success

});

module.exports = router;


router.post("/names", function (req, res)
{
    console.log(req.body)
    console.log("user fetch received")

    let searchLetters = req.body.data
    
    if (searchLetters != "")
    {
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

            let index = 0;

            rawData = result;
            
            stateValidObject = [];
            let keyCounter = 0

            // Grab each value
            result.forEach(function (arrayItem) {
                var x = arrayItem;
                console.log(x);

                let name = arrayItem.first_name + " " + arrayItem.last_name 
                let email = arrayItem.degree

                stateValidObject.push({title: name, description: email, key:++keyCounter} )
            });

            console.log(stateValidObject);

            // send response back
            res.json({
                status: "success",
                received: req.body,
                foundUsers: stateValidObject,
            });
        });
    }
})