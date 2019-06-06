const mongoose = require("mongoose");
const Ai = require("../models/ai.model");
require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const universeController = {};

universeController.explore = function(req, res) {
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

// universeController.connectOrbit = funtion(req, res) {

// };

// universeController.connectOrbit = function(ai) {
// 	let orbit = ai.orbit;
// 	return orbit;
// };

module.exports = universeController;

