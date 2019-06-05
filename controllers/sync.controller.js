const passport = require("passport");
const mongoose = require("mongoose");
const Ai = require("../models/ai.model");

require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const syncController = {};

// Restrict access to root page
syncController.home = function(req, res) {
	// redirect to universe if synced
	if(req.isAuthenticated()) {
		mongoose.connect(url,  { useNewUrlParser: true }).then(
			() => {
				Ai.findOne({ _id: req.session.passport.user }, function (err, ai) {
					if (err) {
						console.log(err);
					}
					res.render("pages/universe", {
						title : `${process.env.APP_NAME} - Virtual Universe`,
						ai : ai,
						isSynced: req.isAuthenticated()
					});
				});
			}
		);
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