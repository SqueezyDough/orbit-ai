const mongoose = require("mongoose");
const Ai = require("../models/ai.model");
const Orbit = require("../models/orbit.model").OrbitSchema;
const utils = require("./utils/utils.controller");

require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const orbitController = {};

orbitController.explore = function(req, res) {
	mongoose.connect(url, { useNewUrlParser: true });

	utils.findOrbit(req.params.id).then(function(orbit) {
		utils.findAi(orbit.ownerId).then(function(ai) {
			res.render("pages/explore", {
				title : `${process.env.APP_NAME} - ${ai.serialNr}'s Orbit`,
				ai : ai,
				url : "",
				orbit : orbit,
				planets : orbit.planets,
				isSynced: req.isAuthenticated()
			});
		});
	});
};

orbitController.createOrbit = async function(ai) {
	mongoose.connect(url,  { useNewUrlParser: true });

	let OrbitSchema = mongoose.model("Orbit", Orbit);

	// create ownership, connect ai to orbit
	let orbit = new OrbitSchema({
		ownerId : ai._id,
		activeConnections : ai._id,
	});

	// find possible candidates
    Ai.find({ _id: { $ne: ai._id }}, (err, ais) => {
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

orbitController.connectOrbits = function (req, res) {
	utils.findAi(req.session.passport.user).then(function(callerAi) {
		utils.findOrbitByOwner(callerAi._id).then(function(callerOrbit) {
			utils.findOrbit(req.params.id).then(function(targetOrbit) {
				utils.findAi(targetOrbit.ownerId).then(function(targetAi) {
					targetOrbit.activeConnections.push(callerAi._id);
					callerAi.orbits.push(targetOrbit._id);
					targetAi.orbits.push(callerOrbit._id);
					callerOrbit.activeConnections.push(targetAi._id);

					targetOrbit.save(function (err) {
						if (err) {
							console.log(err);
						}
					});

					callerAi.save(function (err) {
						if (err) {
							console.log(err);
						}
					});

					targetAi.save(function (err) {
						if (err) {
							console.log(err);
						}
					});

					callerOrbit.save(function (err) {
						if (err) {
							console.log(err);
						}
					});

					res.redirect(`./${req.params.id}`);
				});
			});
		});
	});
};

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