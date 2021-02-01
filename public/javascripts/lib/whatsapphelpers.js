let chatPL = require("./payloads/chatApiPayload");

let whatsappToKoopidTransform = (whatsAppPayload, koopidStructure)=>{
    let result = koopidStructure;
}


let whatsappToTobiTransform = (whatsAppPayload, convoID)=>{
    let result = chatPL.payload;
    result.message = whatsAppPayload.text;
    result.identifier = convoID ? convoID : "";


    return result;
}

let tobiToWhatsappTransform = (endpoint,userID,password,sendTo)=>{
    return `${endpoint}?method=SendMessage&format=json&userid=${userID}&password=${password}&send_to=${sendTo}&v=1.1&auth_scheme=plain&msg_data=DATA_TEXT&msg=`
}

let getTobiMessages = (messagesArray)=>{
    let textMessages = messagesArray.filter((message)=>{
        return (message.content.textMessage && message.content.textMessage.textPlain);
    })

   let textContent = textMessages.map((message)=>message.content.textMessage.textPlain)
   return textContent;
}

let isTextMessage = payload=>payload.type==="text";

let buildQueryFromObject = (queryObject) => {
    let q = "";
    for (const query in queryObject) {
        if (queryObject.hasOwnProperty(query)) {
            q = q + `&${query}=${queryObject[query]}`;
        }
    }
    return q.substr(1);
}

let isActiveConvo = (convoMeta,sendTo)=>{
    return (convoMeta.filter(convo=>sendTo==convo.from).length > 0)
}

let getConvoDestisnation = (convoMeta)=>{
    return convoMeta.destination;
}

let getConvoIndexFromSendTo = (convoMeta,sendTo)=>{
    return convoMeta.indexOf(convoMeta.filter(convo=>sendTo==convo.from)[0])

}


exports.isTextMessage = isTextMessage;
exports.whatsappToTobiTransform = whatsappToTobiTransform;
exports.tobiToWhatsappTransform = tobiToWhatsappTransform;
exports.getTobiMessages = getTobiMessages;
exports.buildQueryFromObject = buildQueryFromObject;
exports.isActiveConvo = isActiveConvo;
exports.getConvoIndexFromSendTo = getConvoIndexFromSendTo;
exports.getConvoDestisnation = getConvoDestisnation;