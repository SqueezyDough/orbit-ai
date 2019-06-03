/* eslint-disable no-console */
const mongoose = require("mongoose");
const schema = require("../models/ai.model").AiSchema;
const moment = require("moment");

require("dotenv").config();

// conn string
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

exports.ai_newSync = function (req, res) {
    res.render("pages/sync-module", {
		title: "Sync new module",
    });
};

// create
exports.ai_create = function (req, res) {
    mongoose.connect(url,  { useNewUrlParser: true }).then(
        () => {
            // construct model
			let AiSchema = mongoose.model("Ai", schema);

			// format date so db is happy
			let formatDate = moment(req.body.contructionDate).format("YYYY-DD-MM");

            // create new instance of user
            let ai = new AiSchema({
                serialNr : req.body.serialNr,
                password: req.body.password,
                instanceName: req.body.instanceName,
                brandName: req.body.brandName,
				contructionDate: new Date(formatDate),
				gender: req.body.gender,
				intelligence: req.body.intelligence,
				environment: req.body.environment,
				shape: req.body.shape,
				abilities: req.body.abilities
            });

            // save user
            ai.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`User created: \n ${ai}`);
                    res.send(`User created: \n ${ai}`);
                }
            });
        },
        err => { console.log(err); }
    );
};