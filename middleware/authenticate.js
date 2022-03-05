// Json Web Token module 
const jwt = require("jsonwebtoken")


// Middleware function to determine if user token is authenticated or not
const verifyToken = (req, res, next) =>
{
    console.log("Verifying token")
    console.log(req.headers)
    console.log(req.body)

    const token = req.headers["x-access-token"]

    if (!token)
    {
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
                req.userId = decoded.userId;
                next()
            }
        })
    }
}

// Multiple Middleware? 
const authAdmin = (req, res, next) =>
{
    // Authenticate that said user is an admin 

    // Authenticate token first (verify token)

    // Check if user has admin permissions 
    next()
}

module.exports = {
    verifyToken : verifyToken,
    authAdmin: authAdmin
}