"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const mongoose = require("mongoose");

require("dotenv").config();
require("./config/passport");

const routes = require("./routes/index.js");
const ai = require("./routes/ai.route");

const error = require("./controllers/error.controller");

const path = require("path");
const exphbs = require("express-handlebars");
require("./views/helpers/helpers");

// conn string
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

// connect ro db
mongoose.connect(url, {	useNewUrlParser: true });

const app = express();
const port = process.env.PORT || 3000;

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
	.use("/ai", ai)
	.use(error.notFound)
	.use(error.serverError)
	.listen(port, () => console.log(`App listening on port ${port}!`));