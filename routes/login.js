var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require("jsonwebtoken")

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



// Middleware function to determine if user token is authenticated or not
const verifyToken = (req, res, next) =>
{

    console.log("middleware function")

    const token = req.headers["x-access-token"]

    if (!token)
    {
        res.send("No Token provied, please send in request")
    }
    else
    {
        jwt.verify(token, "changeSecret", (err, decoded) =>
        {
            if (err)
            {   console.log(err)
                res.json({auth:false, message:"Failed to authenticate token"})
            }
            else{
                req.user_id = decoded.id;
                next()
            }
        })
    }

    
}

// refresh token
function generateAccesstoken(userId)
{
    return (jwt.sign({userId}, "changeSecret", 
        {
            expiresIn: '10m', // expires in 5 minutes
        })
    )
}

router.get('/isUserAuthorized', verifyToken,(req, res) =>
{   
    res.json(
        {
            staus:"You are authenticated"
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
        sql = mysql.format("SELECT * FROM users1 WHERE email= ? ", [
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

