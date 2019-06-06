const express = require("express");
const router = express.Router();
var auth = require("../controllers/sync.controller");
var universe = require("../controllers/universe.controller");

// restrict index for logged in user only
router.get("/", auth.home);

router.get("/explore", universe.explore);

// route to sync page
router.get("/sync", auth.sync);

// route for sync action
router.post("/sync", auth.doSync);

//route for unsync action
router.get("/unsync", isLoggedIn, auth.unSync);

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
	res.redirect("/");
	}
}

module.exports = router;