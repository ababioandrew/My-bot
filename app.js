var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");
let colors = require("colors");


var indexRouter = require('./routes/index');
var messagesRoute = require('./routes/messages');
var sendMessageRouter = require('./routes/sendMessage');
let callbackRouter = require("./routes/callback");



var app = express();
//MOVED SERVER DEFINITION FROM BIN/WWW AND BOUND SOCKETS TO SERVER
let server = require("http").Server(app);
global.io = require("socket.io")(server); //Set io to global so it can be accessed outside app.js
global.whatsAppConvMeta = [];

//Koopid payload structure
let koop = require("./public/javascripts/lib/koopid");

let conversation = [];

// SETUP VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(helmet());
//SETUP CONTENT SECURITY POLICY
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'https://nebula-cdn.kampyle.com', 'http://nebula-cdn.kampyle.com', 'http://udc-neb.kampyle.com'],
        scriptSrc: ["'self'", "'unsafe-eval'", 'https://nebula-cdn.kampyle.com', 'http://nebula-cdn.kampyle.com', 'http://nebula-cdn.kampyle.com'],
        imgSrc: ["'self'", 'https://media2.giphy.com', 'http://udc-neb.kampyle.com', 'https://chat.vodafone.com.gh'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://gcpsmapi.vodafone.com', 'https://nebula-cdn.kampyle.com/', 'http://udc-neb.kampyle.com']
    }
}))
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/messages', messagesRoute);
app.use('/sendmessage', sendMessageRouter);
app.use("/callback", callbackRouter);


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err.stack)
    res.status(err.status || 500);
    res.render('error');
});


//CHECK FOR SOCKET CONNECTIONS MADE
io.on("connection", (socket) => {
    console.log(`Socket connection established. Socket ID ===> ${socket.id.toString().red}`);

    socket.on("chat", (data) => {
        console.log(`${data.message} from ${socket.id}`)
        koop.sendToKoopid(data.message, socket.id, data.identifier);

    })
})




//EXPORT APP AND SERVER TO BE USED IN BIN/WWW
module.exports = { app: app, server: server, io: io };
