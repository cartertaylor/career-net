var express = require('express');
var router = express.Router();
const mysql = require('mysql');

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

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("Receiving CSV upload")
    console.log(req.body)
    
    // Send response depending on CSV upload success

});

module.exports = router;

router.post("/search/permissions",authenticate.verifyToken , function (req, res)
{
    console.log(req.body)

    // Grab initial info for searched user
    let searchLetters = req.body.searchedUser.firstName
    let email = req.body.searchedUser.email
    let lastSearchLetters = req.body.searchedUser.lastName
    
    if (searchLetters != "")
    {
        // SELECT *(all) FROM (table) where
        sql = mysql.format("SELECT faculty_permissions2.user_id, permissions2.permission_name, users2.role FROM faculty_permissions2 LEFT JOIN permissions2 ON permissions2.permission_id = faculty_permissions2.permission_id LEFT JOIN users2 ON users2.user_id = faculty_permissions2.user_id WHERE faculty_permissions2.user_id = (SELECT user_id from users2 WHERE first_name = ? and last_name = ? and email = ?)", [
            searchLetters, lastSearchLetters, email
        ]);

        console.log(sql);

        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            
            console.log("THIS IS THE RESULTS")
            console.log(result);



            // Determine role
            let userRoleId = 2;
            if (result.length > 0)
            {
                userRoleId = result[0].role
            }

            rawData = result;
            
            stateValidObject = {
                firstName:searchLetters,
                lastName:lastSearchLetters,
                email:email,
                userType: userRoleId, // Can only change permissions of non Admins
                canUploadNewData:false, 
                majorAccess:[]
            };

            // Grab each value
            result.forEach(function (arrayItem) {
                console.log("This is an iteration of each")
                console.log(arrayItem.permission_name)
                
                // Check if permission allows for data upload 
                if (arrayItem.permission_name == "Upload New Data")
                {
                    stateValidObject.canUploadNewData = true;
                }
                else
                {   
                    // Otherwise, just add it the major permission as per normal
                    stateValidObject.majorAccess.push(arrayItem.permission_name)
                }
                
            });

            console.log(stateValidObject);

            // send response back
            res.json({
                status: "success",
                received: req.body,
                userPermissions: stateValidObject,
            });
        });
    }
})

router.post("/search", function (req, res)
{
    console.log(req.body)

    let searchLetters = req.body.data
    

    if (searchLetters != "")
    {
        // store the letters that were searched into variable to be checked against data base
        searchLetters = searchLetters + "%";

        sql = mysql.format("SELECT * FROM users2 WHERE first_name LIKE ? or last_name LIKE ?", [
            searchLetters, searchLetters
        ]);
        console.log(sql);

        let dog = connection.query(sql, function (err, result, fields) {
            if (err)
            {
                res.json({
                    status: "Failure",
                    received: req.body,
                    message: "Failed to search for user data"
                });
            }

            console.log(result);

            rawData = result;
            
            stateValidObject = [];
            let keyCounter = 0

            // Grab each value
            result.forEach(function (arrayItem) {
                var x = arrayItem;
                console.log(x);

                let name = arrayItem.first_name + " " + arrayItem.last_name 
                let email = arrayItem.email

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

        console.log("pet the dwawg")
    }
})

router.post("/create", authenticate.verifyToken ,function (req, res) 
{

    console.log(req.body)

    // Status variable to determine to send response or not
    let statusDone = false; 

    // Create Variable for the new user trying to be added's credentials
    let newUserCredentials = req.body.newUserData
    
    // Default row is normal faculty
    let roleId = 2; 
    let password = "password"

    // Get ID of user created this new user from authentication (req.userId) 
    let createdByUserId = req.userId;

    // Get role ID based on provided roles (if Admin : 1, if Normal Faculty : 2)
    if (newUserCredentials.role == "Admin")
    {
        roleId = 1;
    }

    // get current Date
    let currentDate = new Date();  

    // insert user into users table
    let newUserSql = mysql.format("INSERT INTO users2 (email, password, first_name, last_name, date_created, role, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [newUserCredentials.email, password, newUserCredentials.firstName, newUserCredentials.lastName, currentDate, roleId, createdByUserId])

    console.log(newUserSql)

    // Attempt to create new user
    try {
        connection.query(newUserSql, function (err, result, fields) {
            console.log(result)
            if (err) 
            {
                console.log("[mysql error]",err);
                res.json({
                    status: "Failure",
                    received: req.body,
                    message: "Unable to add user " + newUserCredentials.firstName + " "+ newUserCredentials.lastName + " . If this problem persists, please contact an administrator."
                    
                });
                return err;
                
            }
            
            // Id for newly added user
            let newUserId = result.insertId;

            // If not admin, add the permissions listed
            try {
                if (roleId == 2)
                {      
                    let permissionList = newUserCredentials.majorAccess

                    // Check for permissions for user to upload new data
                    if (newUserCredentials.uploadNewData)
                    {
                        permissionList.push("Upload New Data")
                    }

                    // Create permission, associated with the user_id and permission access associated with permission_id's
                    createPermissionSql = mysql.format("INSERT IGNORE INTO faculty_permissions2 (user_id, permission_id) SELECT ?, permission_id FROM permissions2 WHERE permission_name IN (?)",
                        [newUserId, permissionList])

                    console.log(createPermissionSql)

                    connection.query(createPermissionSql, function (err, result, fields) {
                        if (err)
                        {
                            console.log("[mysql error]",err);
                            res.json({
                                status: "Failure",
                                received: req.body,
                                message: "Unable to add user " + newUserCredentials.firstName + " "+ newUserCredentials.lastName + " . If this problem persists, please contact an administrator."
                                
                            });
                            return err;
                        }
                        console.log(result)

                        res.info = "New user permissions added"

                        statusDone = true

                    }) 
                    
                }
                
                else 
                {
                    statusDone = true
                }
            }
            // Catch error for permission adding
            catch (err)
            {
                console.log(err)

                // Send failure response back
                res.json({
                    status: "Failure",
                    received: req.body,
                    message: "Unable to add user " + newUserCredentials.firstName + " "+ newUserCredentials.lastName + " . If this problem persists, please contact an administrator."
                    
                });
            }
        
            
            // send Success response back
            res.json({
                status: "Success",
                received: req.body,
                message: newUserCredentials.firstName + " "+ newUserCredentials.lastName +" was added to the system with a role of: " + newUserCredentials.role
                
            });

        });
}
    // Catch error for adding user
    catch (err)
    {
        console.log(err)

        // Send failure response back
        res.json({
            status: "Failure",
            received: req.body,
            message: "Unable to add user " + newUserCredentials.firstName + " "+ newUserCredentials.lastName + " . If this problem persists, please contact an administrator."
            
        });
    }
})


