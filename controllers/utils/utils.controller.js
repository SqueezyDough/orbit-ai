const mongoose = require("mongoose");
const Ai = require("../../models/ai.model");
const Orbit = require("../../models/orbit.model");
require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const utilsController = {};

utilsController.findAi = function(id) {
	mongoose.connect(url, { useNewUrlParser: true });
	return Ai
			.findOne({ _id: id })
			.then(function(ai) {
				return ai;
		}
	);
};

utilsController.findOrbit = function(id) {
	mongoose.connect(url, { useNewUrlParser: true });
	return Orbit
			.findOne({ _id: id })
			.then(function(orbit) {
				return orbit;
		}
	);
};

utilsController.findOrbitByOwner = function(id) {
	mongoose.connect(url, { useNewUrlParser: true });
	return Orbit
			.findOne({ ownerId: id })
			.then(function(orbit) {
				return orbit;
		}
	);
};

utilsController.getOrbits = function(id) {
	mongoose.connect(url, { useNewUrlParser: true });
	return Orbit
			.find({ activeConnections: id })
			.then(function(orbit) {
				return orbit;
		}
	);
};

utilsController.mergeOrbits = function(orbits) {
	let mergedOrbit = [];
	orbits.forEach( (orbit) => {
		mergedOrbit.push(orbit.planets);
	});

	return mergedOrbit[0];
};

utilsController.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
	res.redirect("/");
	}
};

module.exports = utilsController;