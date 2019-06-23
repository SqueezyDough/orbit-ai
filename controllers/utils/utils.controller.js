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

utilsController.mergeOrbits = function(orbits, ownerOrbit) {
	let mergedOrbit = [];
	let orbit = [];

	orbits.forEach( (orbit) => {
		let planets = orbit.planets;

		// remove self from orbits
		if (orbit.planets.includes(ownerOrbit._id)) {
			let index = orbit.planets.indexOf(ownerOrbit._id);
			orbit.planets.splice(index, 1);
		}

		planets.forEach( (planet) => {
			let str = JSON.stringify(planet);

			// check if there are duplicates
			if (mergedOrbit.includes(str)) {
				console.log(`Planet: ${planet} already in orbit`);
			} else {
				mergedOrbit.push(str);
			}
		});
	});

	mergedOrbit.forEach( (str) => {
		// eslint-disable-next-line quotes
		str = str.replace(/"/g,"");
		orbit.push(str);
	});

	return orbit;
};

utilsController.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
	res.redirect("/");
	}
};

module.exports = utilsController;