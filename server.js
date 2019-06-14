"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const Filter = require("bad-words");

require("dotenv").config();
require("./config/passport");

const routes = require("./routes/index.js");
const ai = require("./routes/ai.route");
const { generateMessage } = require("./controllers/utils/utils.controller");

const path = require("path");
const exphbs = require("express-handlebars");
require("./views/helpers/helpers");

const app = express();
const port = process.env.ENV_PORT || 3000;

const server = require("http").Server(app);
var io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast.emit("message", generateMessage("A new user has joined!"));

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!");
        }

        io.emit("message", generateMessage(message));
        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"));
	});
});

// const chatServer = require("http").createServer(app);
// const io = socketio(chatServer);

app
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use("/lib", express.static(path.join(__dirname, "lib")))
	.use(cookieParser())
	.use(flash())
	.use(session({
		secret: process.env.APP_SECRET,
		resave: false,
		saveUninitialized: false}))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(passport.initialize())
	.use(passport.session())
	.set("view engine", "handlebars")
	.engine("handlebars", exphbs({
		defaultLayout: "main",
		partialsDir: __dirname + "/views/partials"}))
	.use("/", routes)
	.use("/ai", ai);

server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
