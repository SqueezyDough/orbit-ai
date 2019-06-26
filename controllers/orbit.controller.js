const mongoose = require("mongoose");
const Ai = require("../models/ai.model");
const AiSchema = require("../models/ai.model").AiSchema;
const Orbit = require("../models/orbit.model").OrbitSchema;
const utils = require("./utils/utils.controller");
const _url = require("url");

require("dotenv").config();

mongoose.set("useFindAndModify", false);

const orbitController = {};

// explore someone elses orbit
orbitController.explore = function(req, res) {
	utils.findOrbit(req.params.id).then(function(orbit) {
		// remove self from this orbit if found
		utils.findOrbitByOwner(req.session.passport.user).then(function(ownOrbit) {
			if (orbit.planets.includes(ownOrbit._id)) {
				let index = orbit.planets.indexOf(ownOrbit._id);
				orbit.planets.splice(index, 1);
			}

			utils.findAi(orbit.ownerId).then(function(ai) {
				let connected = false;

				// check if AI is connected
				if (orbit.activeConnections.includes(req.session.passport.user) || req.query.connected) {
					connected = true;
				}

				res.render("pages/explore", {
					title : `${process.env.APP_NAME} - ${ai.serialNr}'s Orbit`,
					ai : ai,
					url : "",
					orbit : orbit,
					abilities : ai.properties.abilities,
					planets : orbit.planets,
					connected : connected,
					isSynced: req.isAuthenticated()
				});
			});
		});
	});
};

// create a new orbit on account creation
orbitController.createOrbit = async function(ai) {
	let OrbitSchema = mongoose.model("Orbit", Orbit);

	// create ownership, connect ai to orbit
	let orbit = new OrbitSchema({
		ownerId : ai._id,
		activeConnections : ai._id,
	});

	// find possible candidates
	Ai.find({ _id: { $ne: ai._id }}, (err, ais) => {
		// only look for a match if other ais are found
		if (ais.length > 0) {
			let matchedAis = 0;

			// check for potential matches
			ais.forEach( (_ai) => {
				if (isMatch(ai, _ai)) {
					matchedAis++;
					// push matched ais to orbit
					_ai.orbits.forEach( (_orbit) => {
						orbit.planets.push(_orbit);
					});
				}
			});

			// if no match is found just add the last 3.
			if (matchedAis == 0) {
				for (let i = (ais.length - 1); i >= (ais.length - 3); i--) {
					try {
						orbit.planets.push(ais[i].orbits[ais[i].orbits.length - 1]);
					} catch (err) {
						console.log(err);
					}
				}
			}
		}

		// push orbit to ai orbit
		ai.orbits.push(orbit._id);

		orbit.save(function (err) {
			if (err) {
				console.log(err);
			}
		});

		ai.save(function (err) {
			if (err) {
				console.log(err);
			}
		});
	});
};

// connect 2 orbits and their owners
orbitController.connectOrbits = function (req, res) {
	try {
		// find caller ai
		utils.findAi(req.session.passport.user).then(function(callerAi) {
			// find target orbit
			utils.findOrbit(req.params.id).then(function(targetOrbit) {
				// push target orbit to caller ai's orbit
				callerAi.orbits.push(targetOrbit._id);

				// save caller
				callerAi.save(function (err) {
					if (err) {
						console.log(err);
					}
				});

				// add the caller to the planets in the target orbit
				// this will enable the owner from the target orbit to find the caller and move up in the orbit chain
				utils.findOrbitByOwner(callerAi._id).then(function(callerOrbit) {
					// check if logged in ai is not in this orbit
					if (!targetOrbit.planets.includes(callerOrbit._id)) {
						targetOrbit.planets.push(callerOrbit._id);
					}

					// add this connections to the target orbit
					targetOrbit.activeConnections.push(callerAi._id);

					// save target orbit
					targetOrbit.save(function (err) {
						if (err) {
							console.log(err);
						}
					});
				});

				// redirect to orbit
				res.redirect(_url.format({
					pathname:`./${req.params.id}`,
					query: {
						"connected": true,
					}
				}));
			});
		});
	} catch(err) {
		console.log("connection failed", err);
	}
};

// disconnect from someones orbit
orbitController.disconnectFromOrbit = function(req, res) {
	try {
		// find caller ai
		utils.findAi(req.session.passport.user).then(function(callerAi) {
			// find target orbit
			utils.findOrbit(req.params.id).then(function(targetOrbit) {
				let OrbitSchema = mongoose.model("Orbit", Orbit);

				OrbitSchema.findOneAndUpdate(
					{ _id: targetOrbit._id },
					{ "$pull": { "activeConnections": callerAi._id }},
					{ safe: true, multi:true }, function(err) {
						if (err) {
							console.log(err);
						}
					});

				let Schema = mongoose.model("Ai", AiSchema);

				Schema.findOneAndUpdate(
					{ _id: callerAi._id },
					{ "$pull": { "orbits": targetOrbit._id }},
					{ safe: true, multi:true }, function(err) {
						if (err) {
							console.log(err);
						}
					});

				res.redirect("/ai/account");
			});
		});
	} catch(err) {
		console.log("disconnect failed", err);
	}
};

// scout an orbit before exploring
orbitController.scoutOrbit = function (req, res) {
	utils.findOrbit(req.params.id).then(function(orbit) {
		// count all planets in orbit
		let satellitesInOrbit = orbit.planets.length;

		utils.findOrbitByOwner(req.session.passport.user).then(function(ownerOrbit) {
			// check if logged in ai's orbit is in orbit. If so, subtract in from counter
			if (orbit.planets.includes(ownerOrbit._id)) {
				satellitesInOrbit--;
			}

			res.write(JSON.stringify(satellitesInOrbit) );
			res.end();
		});
	});
};

// check if two ai's match
function isMatch(ai, candidateAi) {
	let keys = Object.values(Object.keys(ai.properties));
	let matchedProperties = 0;

	for (let i = 0; i < keys.length; i++) {
		if (ai.properties[keys[i]] == candidateAi.properties[keys[i]]) {
			matchedProperties++;
		}
	}

	if (matchedProperties >= 3) {
		return true;
	}

	return false;
}

module.exports = orbitController;