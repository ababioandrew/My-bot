let startConvoBody = {
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
                    "textPlain": ""
                }
            }
        }]
    },
    "metadata": {
        "channel": "Web Client"
    }
}

let continueConvoBody = {
    "conversation": {
        "identifier": {
            "id": "5f0d938ce6f64262b3adc67ee334e556",
            "name": "TOBi"
        }
    },
    "from": {
        "identifier": {
            "id": "WA_GH_DEV",
            "name": "WA_GH_DEV"
        },
        "avatar": "string"
    },
    "messages": {
        "timestamp": "string",
        "message": [{
            "messageId": 0,
            "content": {
                "textMessage": {
                    "textPlain": ""
                }
            }
        }]
    },
    "capabilities": {
        "supportsSynchronousCommunication": true,
        "supportsAsynchronousCommunication": true,
        "hasChatHistory": true,
        "hasTextPlain": true,
        "hasTextHtml": true,
        "hasTextMarkdown": true,
        "hasAttachment": true,
        "supportsLocation": true,
        "supportsQuickReplies": true,
        "hasCalloutButton": true,
        "supportsCards": true,
        "supportsEventTyping": true,
        "supportsEventPause": true,
        "supportsEventMessageRead": true,
        "supportsEventNoInputExpected": true,
        "supportsEventUrlAccess": true,
        "sessionValidity": 0
    },
    "metadata": {
        "channel": "Web Client"
    }
}


exports.startConvoBody = startConvoBody;
exports.continueConvoBody = continueConvoBody;