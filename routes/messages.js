var express = require('express');
var router = express.Router();
var watson = require("../public/javascripts/lib/watson");
var startconvobody = require("../public/javascripts/lib/convobody.js");

let token;
let gotToken = false;
let convoInSession = false;
let currentMessageBody = startconvobody.startConvoBody;
let continueConvoBody = startconvobody.continueConvoBody;


/* GET tobi's response */
router.post('/', function(req, res, next) {
    let routerResponse = res;

    console.log(currentMessageBody.messages.message[0]);
    //CONTINUE ONGOING CONVO
    if (req.body.identifier) {
        continueConvoBody.conversation.identifier.id = req.body.identifier;
        continueConvoBody.messages.message[0].content.textMessage.textPlain = req.body.message;
        watson.getAccessToken(routerResponse, continueConvoBody, watson.continueConvo);

    } else {
        //START NEW CONVO
        currentMessageBody.messages.message[0].content.textMessage.textPlain = req.body.message;
        watson.getAccessToken(routerResponse, currentMessageBody, watson.sendMessage);
    }

    console.log(req.body)


});

module.exports = router;