let identifier = "";
let convoClosed = false;
let parentDiv;
let handOverHistory = []; //conversation history for handover
let destination = "bot";
let firstMessageSent = false;

function stringHist(history) {
    if (history.length > 10) {
        history = history.slice(history.length - 10);
    }
    let histString = "";
    for (i = 0; i <= history.length; i++) {
        histString += history[i] ? history[i].origin + ": " + history[i].message + "\n \n" : "";
    }
    return histString;
}


function pauseAllMediaOnPage() {
    pauseAllAudioOnPage();
    pauseAllVideosOnPage();
}

function pauseAllVideosOnPage() {
    //first get list of elements with video tag    
    var listOfVideosOnPage = document.getElementsByTagName('video');
    //loop through the list and call the pause() function on each
    for (var i = 0; i <= listOfVideosOnPage.length; i++) {
        //add try catch in case the item in the list may be undefined or null
        //quicker than doing check for undefined ann null before calling pause() on the element
        try {
            listOfVideosOnPage[i].pause();
        } catch (exception) {

        }
    }
}

function pauseAllAudioOnPage() {
    //first get list of elements with video tag    
    var listOfAudioOnPage = document.getElementsByTagName('audio');
    //loop through the list and call the pause() function on each
    for (var i = 0; i <= listOfAudioOnPage.length; i++) {
        //add try catch in case the item in the list may be undefined or null
        //quicker than doing check for undefined ann null before calling pause() on the element
        try {
            listOfAudioOnPage[i].pause();
        } catch (exception) {

        }
    }
}


function processResponse(data) {
    console.log("Starting processing...");
    console.log(handOverHistory);

    //pause all video and audio on page when a new message is received
    pauseAllMediaOnPage();

    let messageArray = [];
    let quickReplies = [];
    let calloutButtons = [];
    let linkEmbedded;
    let linkEnding;
    let link;
    let returnedMessage = JSON.parse(data);
    if (returnedMessage.metadata && returnedMessage.metadata.agentHandoverRequired) {
        destination = "agent";
        if (!firstMessageSent) {
            socket.emit("chat", {
                message: stringHist(handOverHistory),
                identifier: identifier
            });
            firstMessageSent = true;
        }
    }


    try {
        if (returnedMessage.conversation.identifier.id.length >= 30) {
            identifier = returnedMessage.conversation.identifier.id;

        }
    } catch (e) {
        console.log("no convo");
    }
    //console.log(identifier);
    returnedMessage = returnedMessage.messages.message;

    //console.log(returnedMessage)
    returnedMessage.forEach(message => {
        if (message.content.textMessage && message.content.textMessage.textPlain) {
            linkEmbedded = message.content.textMessage.textPlain.indexOf("http");
            console.log(linkEmbedded);
            if (!(linkEmbedded == -1)) {
                console.log(linkEmbedded);
                linkEnding = message.content.textMessage.textPlain.indexOf(" ", linkEmbedded);
                link = message.content.textMessage.textPlain.substring(linkEmbedded, linkEnding);
                message.content.textMessage.textPlain = message.content.textMessage.textPlain.replace(link, `<a href="${link}">${link}</a>`);
            }
            handOverHistory.push({ origin: "bot", message: message.content.textMessage.textPlain, timestamp: moment.now() });
            messageArray.push(message.content.textMessage.textPlain);
        } else if (message.content.attachment && (message.content.attachment.contentType == "image")) {
            messageArray.push(`<img src="${message.content.attachment.url}" alt="convoImage"/>`)
            handOverHistory.push({ origin: "bot", message: `<img src="${message.content.attachment.url}" alt="convoImage"/>`, timestamp: moment.now() });


            // Video-tags
        } else if (message.content.attachment && (message.content.attachment.contentType == "video")) {
            //call pauseAllMedia function to pause audio and video on page
            pauseAllMediaOnPage();
            let videoContentTag = `<video controls autoplay>
        <source src="${message.content.attachment.url}"  type="video/mp4"> </source> Unsupported media content</video>`;
            messageArray.push(videoContentTag); handOverHistory.push({ origin: "bot", message: videoContentTag, timestamp: moment.now() });

            // Audio-tags
        } else if (message.content.attachment && (message.content.attachment.contentType == "audio")) {
            //call pauseAllMedia function to pause audio and video on page
            pauseAllMediaOnPage();
            let audioContentTag = `<audio controls autoplay>
        <source src="${message.content.attachment.url}"  type="audio/mpeg"> </source> Unsupported media content</audio>`;
            messageArray.push(audioContentTag); handOverHistory.push({ origin: "bot", message: audioContentTag, timestamp: moment.now() });


        } else if (message.content.quickReplies) {
            message.content.quickReplies.forEach(reply => {
                quickReplies.push(reply.textPlain)
            })
        } else if (message.content.calloutButton) {
            calloutButtons.push(message.content.calloutButton);
            console.log(calloutButtons);

        }
    })
    calloutButtons = calloutButtons.map((x) => {
        if (x.url === "https://nebula-eu.kampyle.com/dig-preview/build/index.html?formId=11016&hostingElement=%7B%22width%22%3A350%2C%22minHeight%22%3A400%2C%22maxHeight%22%3A650%7D") {
            console.log("Medallia Survey");
            let surveywidth = ($(".bubble-wrap").width());
            console.log(surveywidth);
            convoClosed = true;
            return `<div id="chatbot_tnps_survey" style="width:380px; max-width:${0.75 * surveywidth}px"></div>`;
        }
        return `<a href="${x.url}" target="_blank">${x.name}</a>`;
    })
    console.log(calloutButtons);

    calloutButtons.length > 0 ? calloutButtons.forEach(button => {
        messageArray.push(button);
    }) : false;



    quickReplies = quickReplies.map((x) => {
        return {
            question: x,
            answer: x
        }
    });
    //console.log(quickReplies);
    quickReplies = quickReplies.reverse();



    function converse(callback) {
        chatWindow.talk({
            "i-dont-get-it": {
                says: messageArray,
                reply: quickReplies
            }
        },
            "i-dont-get-it"
        )
        window.setTimeout(callback, 2000);
    }

    function syncMedallia() {
        if (messageArray[messageArray.length - 1].includes("chatbot_tnps_survey")) {
            KAMPYLE_ONSITE_SDK.updatePageView()
            console.log($("#chatbot_tnps_survey").width());
            setTimeout(() => {
                $(".bubble:last").width($("#chatbot_tnps_survey").width());
                $(".bubble:last").children().width($("#chatbot_tnps_survey").width());
                $(".bubble:last").css("background-color", $("body").css("background-color"));
                $(".bubble:last").children().css("background-color", $("body").css("background-color"));
                $(".bubble:last").css("padding-left", 0);
                console.log(parentDiv);
            }, 1500);
        }
    }
    converse(syncMedallia);
}



var chatWindow = new Bubbles(document.getElementById("chat"), "chatWindow", {

    inputCallbackFn: function (o) {
        //console.log("Sending post");
        //console.log(o)

        var miss = function () {
            handOverHistory.push({ origin: "user", message: o.input, timestamp: moment.now() });

            if (destination === 'bot') {
                $.post("/messages", {
                    message: o.input,
                    identifier: identifier
                })
                    .done((data) => {
                        console.log("First");
                        if (!convoClosed) {
                            processResponse(data)
                        } else {
                            alert("This conversation is expired. Please refresh to restart");
                        }

                    }).fail(function (xhr, status, error) {
                        alert("Failed to connect to chat. Please check your connection")
                    })
            }
            else {
                socket.emit("chat", {
                    message: o.input,
                    identifier: identifier
                })
            }

        }

        var match = function (key) {
            //console.log(`Key is ${key}`);
            //console.log("***SENT FROM FOUND BLOCK***")

            handOverHistory.push({ origin: "user", message: o.input, timestamp: moment.now() });

            if (destination === 'bot') {
                $.post("/messages", {
                    message: o.input,
                    identifier: identifier
                })
                    .done((data) => {
                        console.log("First");
                        if (!convoClosed) {
                            processResponse(data)
                        } else {
                            alert("This conversation is expired. Please refresh to restart");
                        }

                    }).fail(function (xhr, status, error) {
                        alert("Failed to connect to chat. Please check your connection")
                    })
            }
            else {
                socket.emit("chat", {
                    message: o.input,
                    identifier: identifier
                })
            }
        }


        var strip = function (text) {
            return text.toLowerCase().replace(/[\s.,\/#!$%\^&\*;:{}=\-_'"`~()]/g, "")
        }

        var found = false
        o.convo[o.standingAnswer].reply.forEach(function (e, i) {
            strip(e.question).includes(strip(o.input)) && o.input.length > 0 ?
                (found = e.answer) :
                found ? null : (found = false)
        })
        found ? match(found) : miss()
    }
})


var convo = {
    ice: {
        says: ["Hi there!"],
        reply: []
    }
}

chatWindow.talk(convo)
console.log("button script loaded")

$('body').on('click', 'span.bubble-button', function () {

    var inputText = this.innerHTML;
    handOverHistory.push({ origin: "user", message: inputText, timestamp: moment.now() });


    if (destination === 'bot') {
        $.post("/messages", {
            message: inputText,
            identifier: identifier
        })
            .done((data) => {
                console.log("First");
                if (!convoClosed) {
                    processResponse(data)
                } else {
                    alert("This conversation is expired. Please refresh to restart");
                }

            }).fail(function (xhr, status, error) {
                alert("Failed to connect to chat. Please check your connection")
            })
    }
    else {
        socket.emit("chat", {
            message: inputText,
            identifier: identifier
        })
    }

});