let request = require("request");
let kpayload = require("../lib/koopidpayloads");
let dotenv = require("dotenv");
dotenv.config();

function sendToKoopid(message, socketID, convoID){
    let outgoing = kpayload.outgoing;
    outgoing.message.text = message;
    outgoing.channel.user.id = convoID;
    outgoing.channel.user.name = socketID;
    outgoing.channel.type=process.env.KOOPID_CHANNEL_TYPE;
    outgoing.channel.id = process.env.KOOPID_CHANNEL_ID;
	
	console.log(`message to send is ${JSON.stringify(outgoing)}`);

    request.post({
        url: `${process.env.KOOPID_CALLBACK_URL}?partnerId=${process.env.KOOPID_PARTNER_ID}&providerId=${process.env.KOOPID_PROVIDER_ID}&apiKey=${process.env.KOOPID_API_KEY}`,
        port: process.env.KOOPID_PORT,
        method: process.env.KOOPID_METHOD,
        headers: {
            "Content-Type": process.env.KOOPID_CONTENT_TYPE
        },
        body: JSON.stringify(outgoing)
    }, 
    (error, response, body) => {
        if (error) {
            console.log(error);
            return error;
        }
        if(response.statusCode == 200)
        {
           let responseBody = JSON.parse(response.body);
			console.log(responseBody);
			console.log("success " + response.statusCode)
        }
    })
}

exports.sendToKoopid = sendToKoopid;