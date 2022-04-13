var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require("jsonwebtoken")

// Middleware
const authenticate = require("../middleware/authenticate") 
// Instanstiate database
const connection = require("../database/db")


// ENV variables
const userTable = process.env.USER_TABLE;
const userAdminValue = process.env.USER_ADMIN_VALUE;
const userFacultyValue = process.env.USER_FACULTY_VALUE;


module.exports = router;

// refresh token
function generateAccesstoken(userId)
{
    return (jwt.sign({userId}, "changeSecret", 
        {
            expiresIn: '3h', // expires in 3h
        })
    )
}

router.post('/isAdmin', authenticate.verifyToken,(req, res) =>
{   
    console.log(req)
    console.log("But do we have the user name in our request? Yes")
    console.log(req.userId)

    // Query to check admin status
    let adminStatus = false;
    
    const verifyRoleSql = mysql.format("SELECT role, first_name, last_name from users2 WHERE user_id = ?", [req.userId])

    console.log(verifyRoleSql)

    connection.query(verifyRoleSql, function (err, results)
    {
        if (err) throw err;
        console.log(results[0])
        console.log(results[0].role)

        res.json(
            {
                auth: true, 
                status:"You are authenticatedd",
                userRole: results[0].role,
                userName: results[0].first_name + " " + results[0].last_name
                
            }
        )
    })

}) 

router.post("/login", function (req, res) 
{
    console.log("login attempt")

    let email = req.body.loginCredentials.userName
    let password = req.body.loginCredentials.password // TODO: encrypt password

    console.log(email)
    
    if (email != "" && email != null)
    {
        sql = mysql.format("SELECT * FROM ?? WHERE email= ? ", [userTable,
            email
        ]);
	console.log("checking variables")
	console.log(sql)
	console.log(userTable)
        // Most basic implementation of authorization
        // TODO: Replace with CAS client. On CAS successful authentication -> generate JWT token
    connection.query(sql, function (err, result) 
        { 
		console.log("inside sql query function")
            console.log(result) 
        
        if (result.length > 0 && result[0].password == password)
            {
                
                // Set default values
                let isAdmin = false;
                console.log("valid password")
                
                const id = result[0].user_id

                const token = generateAccesstoken(id) 

                // TODO: Implement refresh token at some point 
                const refreshToken = jwt.sign({id}, "changeSecret")

                console.log(result[0].first_name + " " + result[0].last_name)

                // Figure out if user is admin or not
                if (parseInt(userAdminValue) == result[0].role)
                {
                    isAdmin = true;
                }

                // send response back
                res.json({
                    auth: true,
                    token:token,
                    userName: result[0].first_name + " " + result[0].last_name,
                    isAdmin:isAdmin
                    
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


router.post('/newPassword', authenticate.verifyToken,(req, res) =>
{   
    console.log(req)
    console.log("But do we have the user name in our request? Yes")
    console.log(req.userId)

    // Query to check admin status
    let adminStatus = false;
    
    const verifyRoleSql = mysql.format("SELECT role, first_name, last_name from users2 WHERE user_id = ?", [req.userId])

    console.log(verifyRoleSql)

    connection.query(verifyRoleSql, function (err, results)
    {
        if (err) throw err;
        console.log(results[0])
        console.log(results[0].role)

        res.json(
            {
                auth: true, 
                status:"You are authenticatedd",
                userRole: results[0].role,
                userName: results[0].first_name + " " + results[0].last_name
                
            }
        )
    })

}) 