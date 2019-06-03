"use strict";

const express = require("express");

require("dotenv").config();

// eslint-disable-next-line no-unused-vars
const bodyParser = require("body-parser");

const routes = require("./routes/index.js");
const ai = require("./routes/ai.route");

const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const port = process.env.ENV_PORT;

app
    .use(bodyParser.urlencoded({ extended: false }))
    .use("/", routes)
    .use("/ai", ai)
    .use("/lib", express.static(path.join(__dirname, "lib")))
	.set("view engine", "handlebars")
	.engine("handlebars", exphbs({
		defaultLayout: "main",
		partialsDir: __dirname + "/views/partials"
	}))
    .listen(port, () => console.log(`App listening on port ${port}!`));