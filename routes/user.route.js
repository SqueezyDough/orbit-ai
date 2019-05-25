const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

//router.get('/test', user_controller.test);

router.post("/create", user_controller.user_create);

module.exports = router;