// Json Web Token module 
const e = require("express");
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
                console.log(decoded.userId)
                req.userId = decoded.userId;
                next()
            }
        })
    }
}

function retreivePermissions(req, res, next)
{
    let currentUserId = req.userId;
    let permissionsArray = []
    let sql = mysql.format("SELECT faculty_permissions2.user_id, permissions2.permission_name FROM faculty_permissions2 LEFT JOIN permissions2 ON permissions2.permission_id = faculty_permissions2.permission_id WHERE faculty_permissions2.user_id = ?;", [currentUserId])
    console.log("Finding permissions for logged in user")
    // Attempt to grab permissions
    try
    {
        connection.query(sql, function (err, result)
        {   
            console.log(result[0])

            result.forEach(element=>
                {
                    console.log(element.permission_name)
                    if (element.permission_name != "Upload New Data")
                    {
                        permissionsArray.push(element.permission_name)
                    }
                })

            req.userPermissions = permissionsArray;

            next()
        })
    }
    catch{
            console.log("Failure")
        
    }
}

// Multiple Middleware? 
function authAdmin (req, res, next) 
{
    // Check if user has admin permissions 
    console.log("AUTHORIZING TO MAKE SURE THEY ARE AN ADMIN")

    const verifyRoleSql = mysql.format("SELECT role from users2 WHERE user_id = ?", [req.userId])
    console.log(verifyRoleSql)

    connection.query(verifyRoleSql, function (err,results)
    {   
        // Check rolel of user to make sure they are an admin
        if (results[0].role == 1)
        {
            next()
        }
        else
        {
            console.log("Not verified")
        }
    })
}

module.exports = {
    verifyToken : verifyToken,
    authAdmin: authAdmin,
    retreivePermissions:retreivePermissions
}