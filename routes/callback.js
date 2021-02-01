let router = require("express").Router();
let cred = require("../public/javascripts/lib/credentials");
let app = require("../app");
let clientpl = require("../public/javascripts/lib/koopidpayloads").frontend;

console.log();

router.post("/", (req, res, next)=>{

    let auth = req.headers.authorization;
    let message = req.body;

    function hasAccess(username, password)
    {
       return cred.find(cred=>cred.username==username && cred.password==password);
    }

    if(auth)
    {
        let base64Credentials = auth.split(" ")[1];
        console.log(base64Credentials);
        
        let credentials = new Buffer.from(base64Credentials,'base64').toString();
        console.log(credentials);
        let [username, password] = credentials.split(":");
        console.log(username);
        console.log(password);

        if (hasAccess(username,password))
        {
            
            //io.to(req.body.id).emit("access", `access granted to ${req.body.id}`)
            console.log(req.body);

            clientpl.messages.message[0].content.textMessage.textPlain = req.body.message.text;
            clientpl.conversation.identifier.id = req.body.channel.user.name;

            let returnSocket = req.body.channel.user.name;

            io.to(returnSocket).emit("chat", JSON.stringify(clientpl));


            res
            .status(200)
            .end();
        }
        else
        {
            res
            .status(403)
            .end("Invalid Authorization Token");
        }


        
    }
    else{
        console.log("No credentials");

        res
        .status(401)
        .set("WWW-Authenticate", "Basic realm='callback'")
        .send("Authentication is required")
    }

    


})

module.exports=router;