// Json Web Token module 
const jwt = require("jsonwebtoken")
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

// Middleware function to determine if user token is authenticated or not
const verifyToken = (req, res, next) =>
{
    console.log("Verifying token")
    console.log(req.headers)
    console.log(req.body)

    const token = req.headers["x-access-token"]

    if (!token)
    {
        console.log("No token found")
        res.send("No Token provied, please send in request")
    }
    else
    {
        console.log("Is this the user ID?")

        jwt.verify(token, "changeSecret", (err, decoded) =>
        {
            if (err)
            {   console.log(err)
                res.json({auth:false, message:"Failed to authenticate token"})
            }
            else {

                // Pass the user ID to our original req so it can pull data regarding user 
                console.log("GOing to next")
                req.userId = decoded.userId;
                next()
            }
        })
    }
}

// Multiple Middleware? 
function authAdmin (req, res, next) 
{
    console.log("THIS IS AN AUTHENTICATION FOR ADMIN")
    // Authenticate that said user is an admin 
    
    console.log(req.body)
    console.log(req.headers)

    // Authenticate token first (verify token)
    verifyToken(req,res)

    console.log("Bibbiyu bobity")

    // Check if user has admin permissions 
    console.log(req.userId)

    const verifyRoleSql = mysql.format("SELECT role from users2 WHERE user_id = ?", [req.userId])

    connection.query(verifyRoleSql, function (results, err)
    {
        console.log(results.role)
    })

    
}

module.exports = {
    verifyToken : verifyToken,
    authAdmin: authAdmin
}