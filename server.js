"use strict";

const express = require("express");

// eslint-disable-next-line no-unused-vars
const bodyParser = require("body-parser");

const routes = require("./routes/index.js");
const user = require("./routes/user.route");

const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const port = 3000;

app
    .use(bodyParser.urlencoded({ extended: false }))
    .use("/", routes)
    .use("/users", user)
    .use("/lib", express.static(path.join(__dirname, "lib")))
    .set("view engine", "handlebars")
    .engine("handlebars", exphbs({defaultLayout: "main"}))
    .listen(port, () => console.log(`App listening on port ${port}!`));