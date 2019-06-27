const Ai = require("../../models/ai.model");
const Orbit = require("../../models/orbit.model");
require("dotenv").config();

const utilsController = {};

// find a single a with the id form the session
utilsController.findAi = function(id) {
	return Ai
		.findOne({ _id: id })
		.then(function(ai) {
			return ai;
		}
		);
};

// find orbit by id
utilsController.findOrbit = function(id) {
	return Orbit
		.findOne({ _id: id })
		.then(function(orbit) {
			return orbit;
		}
		);
};

// find orbit by owner id
utilsController.findOrbitByOwner = function(id) {
	return Orbit
		.findOne({ ownerId: id })
		.then(function(orbit) {
			return orbit;
		}
		);
};

// orbits all orbuts where the ai is connected to
utilsController.getOrbits = function(id) {
	return Orbit
		.find({ activeConnections: id })
		.then(function(orbit) {
			return orbit;
		}
		);
};

// merge all orbits where the ai is connected to and return it as one array
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

// look is the ai is logged in
utilsController.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/");
	}
};

module.exports = utilsController;