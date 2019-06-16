const express = require("express");
const router = express.Router();
const ai_controller = require("../controllers/ai.controller");
const utils = require("../controllers/utils/utils.controller");

router.get("/sync-module", ai_controller.ai_newSync);
router.post("/create", ai_controller.ai_create);
router.get("/update", ai_controller.ai_update);
router.post("/update", ai_controller.ai_onUpdate);
router.get("/account", utils.isLoggedIn, ai_controller.ai_overview);
router.get("/connection", utils.isLoggedIn, ai_controller.ai_connection);

module.exports = router;