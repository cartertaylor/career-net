var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("Receiving CSV upload")
    console.log(req.body)
    

    // Send response depending on CSV upload success

});

module.exports = router;
