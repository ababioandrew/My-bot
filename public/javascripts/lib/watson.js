let dotenv = require("dotenv");
let request = require("request");
dotenv.config();

function concatOauth2Body(first, second, third, fourth) {
    let fullBody = "grant_type=" + first + "&client_id=" + second + "&client_secret=" + third + "&scope=" + fourth;
    return fullBody;
}

function getAccessToken(routerResponse, messagebody, callback) {
    let responseBody;

    request.post({
        url: process.env.OAUTH2_URL,
        port: process.env.OAUTH2_PORT,
        method: process.env.OAUTH2_METHOD,
        headers: {
            "Content-Type": process.env.OAUTH2_CONTENT_TYPE
        },
        body: concatOauth2Body(process.env.OAUTH2_GRANT_TYPE, process.env.OAUTH2_CLIENT_ID, process.env.OAUTH2_CLIENT_SECRET, process.env.OAUTH2_SCOPE)
    }, (error, response, body) => {
        if (error) {
            console.log(error);
            return error;
        }
        console.log("GOT TOKEN " + response.body)
        responseBody = JSON.parse(response.body);
        callback(routerResponse, responseBody.access_token, messagebody)
            //return responseBody;
    })
}

function expireToken() {
    return false;
}

function sendMessage(routerResponse, currentToken, currentBody) {
    request.post({
        url: process.env.START_CONVO_URL,
        port: process.env.START_CONVO_PORT,
        method: process.env.START_CONVO_METHOD,
        headers: {
            "Authorization": process.env.START_CONVO_AUTHORIZATION + currentToken,
            "botName": process.env.START_CONVO_BOTNAME,
            "Content-Type": process.env.START_CONVO_CONTENT_TYPE,
            "Accept": process.env.START_CONVO_ACCEPT
        },
        body: JSON.stringify(currentBody)
    }, (error, response, body) => {
        if (error) {
            return error;
        }
        console.log(currentBody.messages.message[0].content);
        console.log("*********************************************")
        console.log(response.body);
        console.log(response.statusCode);
        console.log(response.statusMessage);
        routerResponse.type('html');
        routerResponse.send(response.body)

    })

}

function continueConvo(routerResponse, currentToken, currentBody) {
    request.post({
        url: process.env.CONTINUE_CONVO_URL,
        port: process.env.CONTINUE_CONVO_PORT,
        method: process.env.START_CONVO_METHOD,
        headers: {
            "Authorization": process.env.CONTINUE_CONVO_AUTHORIZATION + currentToken,
            "botName": process.env.CONTINUE_CONVO_BOTNAME,
            "Content-Type": process.env.CONTINUE_CONVO_CONTENT_TYPE,
            "Accept": process.env.CONTINUE_CONVO_ACCEPT
        },
        body: JSON.stringify(currentBody)
    }, (error, response, body) => {
        if (error) {
            return error;
        }
        console.log(currentBody.messages.message[0].content);
        console.log("*********************************************")
        console.log(response.body);
        console.log(response.statusCode);
        console.log(response.statusMessage);
        routerResponse.type('html');
        routerResponse.send(response.body)

    })

}

exports.expireToken = expireToken;
exports.getAccessToken = getAccessToken;
exports.sendMessage = sendMessage;
exports.continueConvo = continueConvo;