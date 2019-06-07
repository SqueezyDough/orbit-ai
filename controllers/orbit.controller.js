const mongoose = require("mongoose");
const Ai = require("../models/ai.model");
const Orbit = require("../models/orbit.model").OrbitSchema;
const utils = require("./utils/utils.controller");
require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const orbitController = {};

orbitController.explore = function(req, res) {
	mongoose.connect(url,  { useNewUrlParser: true });

	Ai.findOne({ _id: req.session.passport.user }, function (err, ai) {
		Ai.find({ _id: { $ne: req.session.passport.user }}, (err, instance) => {
			instance.forEach((instance) => {
				ai.orbit.push(instance);
			});
		});

		// save user
		ai.save(function (err) {
			if (err) {
				console.log(err);
			}
			else {
				res.send(`Orbit updated: \n ${ai.orbit}`);
			}
		});
		console.log(ai.orbit);
	});
};

orbitController.createOrbit = async function(req, res) {
	mongoose.connect(url,  { useNewUrlParser: true });

	utils.findAi(req.session.passport.user).then(function(ai) {
		if (!ai.orbits[0]) {
			let OrbitSchema = mongoose.model("Orbit", Orbit);

			let orbit = new OrbitSchema({
				ownerId : ai._id,
				activeConnections : ai._id,
			});

			Ai.find({ _id: { $ne: ai._id }}, (err, ais) => {
				ais.forEach( (ins) => {
					console.log(ins);
					orbit.planets.push(ins._id);
				});
				// let matchedProperties = 0;

				// for (let p = 0; p < ai.length; p++) {
				// 	console.log(ais[i][p]);
				// 	if (ai[p] == ais[i][p]) {
				// 		//matchedProperties++;
				// 	}
				// }

				//if (matchedProperties >= 5) {

				//}

				ai.orbits.push(orbit._id);

				orbit.save(function (err) {
					if (err) {
						console.log(err);
					}
				});

			});

			ai.save(function (err) {
				if (err) {
					console.log(err);
				}
				else {
					res.send(`Orbit created: \n ${orbit.planets}`);
				}
			});
		} else {
			res.send(`Orbit detected: ${ai.orbits}`);
		}
	});
};

module.exports = orbitController;

