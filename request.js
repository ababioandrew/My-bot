let request = require("request")
request.post({
        url: process.env.START_CONVO_URL,
        port: process.env.START_CONVO_PORT,
        method: process.env.START_CONVO_METHOD,
        headers: {
            "Authorization": "https://eu2-stagingref.api.vodafone.com/v1/chatbot/conversation",
            "botName": "WA_GH_DEV",
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
    "conversation": {
        "identifier": {
            "name": "TOBi"
        }
    },
    "from": {
        "identifier": {
            "id": "WA_GH_DEV",
            "name": "WA_GH_DEV"
        },
        "avatar": "http://www.vodafone.com/TOBi.png"
    },
    "messages": {
        "timestamp": "2017-12-13T02:55:10",
        "message": [{
            "messageId": "1646",
            "content": {
                "textMessage": {
                    "textPlain": "I want internet settings"
                }
            }
        }]
    },
    "metadata": {
        "channel": "Web Client",
        "agentAvailable": false,
        "agentHandover": false,
        "intents": "billingClarification",
        "userAgent": "Vaibhav"
    }
}
)
    }, (error, response, body) => {
        if (error) {
            return error;
        }
        
        console.log(response.body);
        console.log(response.statusCode);
        console.log(response.statusMessage);
    })
