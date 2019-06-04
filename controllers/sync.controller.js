const passport = require("passport");
const syncController = {};

// Restrict access to root page
syncController.home = function(req, res) {
	res.render("home", { ai : req.ai });
	console.log(req.isAuthenticated());
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