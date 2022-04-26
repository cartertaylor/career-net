// Json Web Token module 
const e = require("express");
const jwt = require("jsonwebtoken")
const mysql = require('mysql');


// Instanstiate database
const connection = require("../database/db")


// Import ENV variables
const userAdminValue = parseInt(process.env.USER_ADMIN_VALUE);
const userFacultyValue = parseInt(process.env.USER_FACULTY_VALUE);
const jwtSecret = process.env.JWT_SECRET;
const facultyPermissions = process.env.FACUTY_PERMISSIONS_TABLE;
const selectedUserPermissions = process.env.PERMISSIONS_TABLE;
const userTable = process.env.USER_TABLE;


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
        

        jwt.verify(token, jwtSecret, (err, decoded) =>
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
    // Attempt to grab permissions
    let currentUserId = req.userId;
    let permissionsArray = []
    let sql = mysql.format("SELECT ??.user_id, ??.permission_name, ??.role FROM ?? LEFT JOIN ?? ON ??.permission_id = ??.permission_id LEFT JOIN ?? ON ??.user_id = ??.user_id WHERE ??.user_id = ?;",
        [facultyPermissions, selectedUserPermissions, userTable, facultyPermissions, selectedUserPermissions, selectedUserPermissions,facultyPermissions,userTable, facultyPermissions,userTable,facultyPermissions, currentUserId])
    let userCanUploadNewData = false

    let initialSqlCheck = mysql.format("SELECT role FROM ?? WHERE user_id = ?", [userTable,currentUserId])

    console.log("Current permissions")
    console.log(sql)

    try{
        console.log("Trying")
        connection.query(initialSqlCheck, function (err, result)
        {
            if (result[0].role == userFacultyValue)
            {
                try
                {
                    connection.query(sql, function (err, result)
                    {   
                        console.log(result[0])

                        result.forEach(element=>
                            {
                                console.log(element.permission_name)
                                
                                if (element.permission_name == "Upload New Data")
                                {
                                    userCanUploadNewData = true;
                                }
                                else
                                {
                                    console.log("Adding element")
                                    permissionsArray.push(element.permission_name)
                                }
                                console.log(permissionsArray)
                            })

                        console.log("print permission element")
                        console.log(permissionsArray)

                        // Store permissions in req
                        req.userPermissions = permissionsArray

                    })
                }
                catch{
                    req.errorMessage = "Failure"
                }
            }
            // We are an admin, grab list of majors
            else{

                let adminMajorSql = mysql.format("SELECT permission_name FROM ??", [selectedUserPermissions])

                try{
                    connection.query(adminMajorSql, function(err, result)
                    {

                        console.log("Admin matey")
                        console.log(result)

                        result.forEach(element=>
                            {
                                console.log(element.permission_name)
                                
                                if (element.permission_name == "Upload New Data")
                                {
                                    userCanUploadNewData = true;
                                }
                                else
                                {
                                    console.log("Adding element")
                                    permissionsArray.push(element.permission_name)
                                }
                            })
                        
                        // Store permissions in req
                        req.userPermissions = permissionsArray

                        next()
                    })
                }
                catch
                {
                    req.errorMessage = "Failure"
                }


            }
        })

        // Attempt to grab permissions
        
    }
    catch
    {
        req.errorMessage = "Failure"
    }
}

// MIddleware that tells if user is authenticated as an admin or not
function authAdmin (req, res, next) 
{
    // Check if user has admin permissions 
    console.log("AUTHORIZING TO MAKE SURE THEY ARE AN ADMIN")

    const verifyRoleSql = mysql.format("SELECT role from ?? WHERE user_id = ?", [userTable,req.userId])
    console.log(verifyRoleSql)

    connection.query(verifyRoleSql, function (err,results)
    {   
        // Check rolel of user to make sure they are an admin
        if (results[0].role == userAdminValue)
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