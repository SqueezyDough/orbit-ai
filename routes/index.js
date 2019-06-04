const express = require("express");
const router = express.Router();
var auth = require("../controllers/sync.controller");

// restrict index for logged in user only
router.get("/", auth.home);

// route to sync page
router.get("/sync", auth.sync);

// route for sync action
router.post("/sync", auth.doSync);

//route for unsync action
router.get("/unsync", auth.unSync);

module.exports = router;