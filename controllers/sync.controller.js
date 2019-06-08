const passport = require("passport");
require("dotenv").config();
const utils = require("./utils/utils.controller");

const syncController = {};

// Restrict access to root page
syncController.home = function(req, res) {
	// redirect to orbit if synced
	if(req.isAuthenticated()) {
		utils.findAi(req.session.passport.user).then(function(ai) {
			utils.getOrbits(ai._id).then(function(orbits) {
				let planets = utils.mergeOrbits(orbits);

				res.render("pages/orbit", {
					title : `${process.env.APP_NAME} - Orbit`,
					ai : ai,
					planets : planets,
					isSynced: req.isAuthenticated()
				});
			});
		});
	} else {
		// anonymous ais
		res.render("home");
	}
};

// Go to login page
syncController.sync = function(req, res) {
  res.render("pages/sync");
};

// Post login
syncController.doSync = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/sync",
		failureFlash: true
	})(req, res, next);
};

// logout
syncController.unSync = function(req, res) {
  req.logout();
  res.redirect("/");
};

module.exports = syncController;