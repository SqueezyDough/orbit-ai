const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

router.get("/join", user_controller.user_join);
router.post("/create", user_controller.user_create);

module.exports = router;