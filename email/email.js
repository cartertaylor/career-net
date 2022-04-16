// Json Web Token module 
const mysql = require('mysql');


// Import email
const nodemailer = require('nodemailer');


// Import user type values 
const emailPassword = process.env.EMAIL_PASSWORD
const serverName = process.env.SERVER_NAME

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "careernetnoreply@gmail.com",
        pass: emailPassword,
    },
});

// Function sends an email with a link to reset the users password
function sendResetPasswordEmailWithKey(sentToEmail, key) {
    console.log("Attempting to send")
    let clickLink = 'http://' + serverName +'/?#/updatePassword?authKey=' + key 
    let htmlBody = '<p>Hello from CareerNet, <br> <br> We received a request to reset the password for the CareerNet account associated with this e-mail address. Click the link below to reset your password.<br><br></p>'
    
    let htmlLink ='<a href="'+ clickLink + '">' +clickLink+'</a>'

    console.log(htmlLink)

    let htmlEnd = '<br><br>If the Link is not clickable for some reason, please enter into the top of your browsers URL box in a new tab'

    let fullHTML =  '<html><body>' + htmlBody + htmlLink +htmlEnd +'</body></html>'
    

    // text:"Hello from CareerNet, \n\n We received a request to reset the password for the CareerNet account associated with this e-mail address. Click the link below to reset your password.\n\n",
    let mailOptions = {
        from: "careernetnoreply@gmail.com",
        to: sentToEmail,
        subject: "CareerNet Password reset",
        html:fullHTML
        
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent to : " + sentToEmail + " With a key of " + key + " \n"+ info.response);
        }
    });
}

module.exports = {
    sendResetPasswordEmailWithKey:sendResetPasswordEmailWithKey
}