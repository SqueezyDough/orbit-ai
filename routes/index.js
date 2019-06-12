const express = require("express");
const router = express.Router();
const auth = require("../controllers/sync.controller");
const orbit = require("../controllers/orbit.controller");
const utils = require("../controllers/utils/utils.controller");

// restrict index for logged in user only
router.get("/", auth.home);

router.get("/explore/:id", utils.isLoggedIn, orbit.explore);

router.get("/create-orbit", utils.isLoggedIn, orbit.createOrbit);

// route to sync page
router.get("/sync", auth.sync);

// route for sync action
router.post("/sync", auth.doSync);

//route for unsync action
router.get("/unsync", utils.isLoggedIn, auth.unSync);

module.exports = router;