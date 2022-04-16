var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require("jsonwebtoken")
const bcrypt = require ('bcryptjs');

// Middleware
const authenticate = require("../middleware/authenticate") 
// Instanstiate database
const connection = require("../database/db")

// import email function 
const email = require("../email/email")



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
    
    const verifyRoleSql = mysql.format("SELECT role, first_name, last_name from ?? WHERE user_id = ?", [userTable,req.userId])

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



router.post('/newPassword', (req, res) =>
{   
    console.log(req.body)


    // Grab req variables
    let providedKey = req.body.providedKey
    const newPassword = req.body.passwords.confirmPassword

    if (providedKey == null)
    {
        providedKey = "nullisa"
    }

    // Select user where authId matches the ones in the tables
    const verifyKeySql = mysql.format("SELECT user_id, first_name, last_name, password_auth_key from ?? WHERE password_auth_key = ?", [userTable, providedKey])

    console.log(verifyKeySql)
    try
    {
        connection.query(verifyKeySql, function (err, results)
        {
            if (err) throw err;

            if (results.length > 0)
            {
                console.log(results[0])
                let foundUser = (results[0].user_id)
                
                // Update password with new one provided
                let updatePasswordSql = mysql.format("UPDATE ?? SET password = ?, password_auth_key= ? WHERE user_id = ?", [userTable, newPassword, null, foundUser])
                console.log(updatePasswordSql)
                
                // Update password
                try {
                    console.log("reee")

                    connection.query(updatePasswordSql, function (err, results)
                    {
                        res.json(
                            {
                                updated: true, 
                                status:"You are authenticatedd",
                            }
                        )
                    })
                }
                catch 
                {
                    res.json(
                        {
                            updated: false, 
                            status:"Failed to Authenticate key",
                            
                        }
                    )
                }
            }
            else
            {
                res.json(
                    {
                        updated: false, 
                        status:"Failed to Authenticate key",
                        
                    }
                )
            }

        })
    }
    catch
    {
        res.json(
            {
                updated: false
            }
        )
    }

}) 


router.post('/sendResetEmail', (req, res) =>
{
    console.log("Checking key")
    console.log(req.body)


    const resetEmailKey = stringGen(15)

    const resetEmail = req.body.userEmail.resetEmail
    
    // Select user where authId matches the ones in the tables
    const checkEmailExist = mysql.format("SELECT user_id, first_name, last_name, password_auth_key from ?? WHERE email = ?", [userTable, resetEmail])
    console.log(checkEmailExist)
    connection.query(checkEmailExist, function (err, result )
    {
        if (err)
        {
            res.json(
                {
                    error:true
                }
            )
        }
        console.log("REEE")
        console.log(result)

        if (result.length > 0)
        {

            // Update the users table to include 
            const insertAuthKeySql = mysql.format("UPDATE ?? SET password_auth_key = ? WHERE user_id = ?", [userTable, resetEmailKey, result[0].user_id])
            try{
                console.log("Wo")
                connection.query(insertAuthKeySql, function (err, result )
                    {
                        if (err)
                        {
                            res.json(
                                {
                                    error:true
                                }
                            )
                        }
                        console.log(result)
                        console.log(result.affectedRows)
                        if (result.affectedRows > 0)
                        {
                            // Send email with to users email with the key.
                            email.sendResetPasswordEmailWithKey(resetEmail,resetEmailKey)

                        }
                        res.json(
                            {
                                emailSent:true,
                                error:false
                            }
                        )
                    })
            }
            catch{
                res.json(
                    {
                        emailSent:false,
                        error:false
                    }
                )
            }
            
        }
        else
        {
            res.json(
                {
                    emailSent:false,
                    error:false
                }
            )
        }
    })

    // console.log(verifyKeySql)
})



router.post('/checkAuthenticationKey', (req, res) =>
{

    const providedKey = req.body.providedKey

    console.log("Checking key")
    console.log(req.body)

    // Select user where authId matches the ones in the tables
    const verifyKeySql = mysql.format("SELECT user_id, first_name, last_name, password_auth_key from ?? WHERE password_auth_key = ?", [userTable, providedKey])
    
    connection.query(verifyKeySql, function (err, result )
    {
        console.log("REEE")
        console.log(result)

        if (result.length > 0)
        {
            
            res.json(
                {
                    auth:true
                }
            )
        }
        else
        {
            res.json(
                {
                    auth:false
                }
            )
        }
    })

    // console.log(verifyKeySql)
})




function stringGen(len) {
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }

