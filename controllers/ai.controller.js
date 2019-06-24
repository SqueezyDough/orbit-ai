const mongoose = require("mongoose");
const schema = require("../models/ai.model").AiSchema;
const moment = require("moment");
const orbit = require("../controllers/orbit.controller");
const utils = require("./utils/utils.controller");

require("dotenv").config();

// create account
exports.ai_newSync = function (req, res) {
	res.render("pages/sync-module", {
		title: "Sync new module",
	});
};

// create
exports.ai_create = function (req, res) {
	// construct model
	let AiSchema = mongoose.model("Ai", schema);

	// format date so db is happy
	let formatDate = moment(req.body.constructionDate, "DD-MM-YYYY").format("YYYY-MM-DD");

	// create new instance of user
	let ai = new AiSchema({
		serialNr: req.body.serialNr,
		password: req.body.password,
		instanceName: req.body.instanceName,
		brandName: req.body.brandName,
		constructionDate: new Date(formatDate),
		gender: req.body.gender,
		properties: {
			intelligence: req.body.intelligence,
			environment: req.body.environment,
			shape: req.body.shape,
			abilities: req.body.abilities
		},
	});

	// save user
	ai.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			orbit.createOrbit(ai);
			return res.redirect("/");
		}
	});
};

// update account
exports.ai_update = function (req, res) {
	utils.findAi(req.session.passport.user).then(function (ai) {
		res.render("pages/update", {
			title: `${process.env.APP_NAME} - Update my AI"`,
			ai: ai
		});
	});
};

exports.ai_onUpdate = function (req, res) {
	let AiSchema = mongoose.model("Ai", schema);
	utils.findAi(req.session.passport.user).then(function (ai) {
		AiSchema.findOneAndUpdate({
			serialNr: ai.serialNr
		}, {
			gender: req.body.gender,
			properties: {
				intelligence: req.body.intelligence,
				environment: req.body.environment,
				shape: req.body.shape,
				abilities: req.body.abilities
			}
		}).then(function () {
			res.redirect("account");
        },
        err => { console.log(err); });
	});
};

exports.ai_overview = function (req, res) {
	// find logged in ai
	utils.findAi(req.session.passport.user).then(function(ai){
		// get all orbits where ai is connected to
		utils.getOrbits(ai._id).then( async (orbits) => {
			let connections = [];

			// for every connection, create a new orbit
			for (let _orbit of orbits) {
				// add the owner name and orbit id to the array
				await utils.findAi(_orbit.ownerId).then( (owner) => {
					// don't add if the orbit belongs to itself
					if (_orbit.ownerId != ai._id) {
						// create a new obj for the connection
						let orbit = {};

						// add the name and id as properties
						orbit.id = _orbit._id;
						orbit.ownerName = owner.instanceName;

						// add the obj to the array
						connections.push(orbit);
					}
				});
			}

			res.render("pages/iai", {
				title : `${process.env.APP_NAME} - Hi ${ai.serialNr}!`,
				ai : ai,
				connections : connections,
				isSynced : req.isAuthenticated()
			});
		});
	});
};