var express = require('express');
var router = express.Router();
var request = require("request");

/* POST Message. */
router.get('/sendmessage', function(req, res, next) {
    console.log(req.body);
    request.get()








    res.render('index', { title: 'Send Message' });



});

module.exports = router;