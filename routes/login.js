var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require("jsonwebtoken")

// Middleware
const authenticate = require("../middleware/authenticate") 

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

module.exports = router;


// refresh token
function generateAccesstoken(userId)
{
    return (jwt.sign({userId}, "changeSecret", 
        {
            expiresIn: '10m', // expires in 10 minutes
        })
    )
}

router.get('/isUserAuthorized', authenticate.verifyToken,(req, res) =>
{   
    console.log("But do we have the user name in our request? Yes")
    console.log(req.userId)

    res.json(
        {
            status:"You are authenticated"
        }
    )
}) 

router.post("/", function (req, res) 
{
    console.log("login attempt")

    let email = req.body.loginCredentials.userName
    let password = req.body.loginCredentials.password // TODO: encrypt password

    console.log(email)
    console.log(password)

    if (email != "" && email != null)
    {
        sql = mysql.format("SELECT * FROM users2 WHERE email= ? ", [
            email,
        ]);

        // Most basic implementation of authorization
        // TODO: Replace with CAS client. On CAS successful authentication -> generate JWT token
        connection.query(sql, function (err, result) 
        { 
            console.log(result) 
            console.log(result.length > 0 && result[0].password == password)

            if (result.length > 0 && result[0].password == password)
            {
                console.log("valid password")
                
                const id = result[0].user_id

                const token = generateAccesstoken(id) 

                // TODO: Implement refresh token at some point 
                const refreshToken = jwt.sign({id}, "changeSecret")

                // send response back
                res.json({
                    auth: true,
                    token:token,
                    foundUser: email,
                });
            }


            else{
                res.json({
                    auth: false,
                    message:"Invalid login input"

                });
            }

        })

    }

    else{
        res.json({status:"Failed"})
    }
})

