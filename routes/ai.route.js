const express = require("express");
const router = express.Router();
const ai_controller = require("../controllers/ai.controller");

router.get("/sync-module", ai_controller.ai_newSync);
router.post("/create", ai_controller.ai_create);
router.get("/account", ai_controller.ai_overview);

module.exports = router;