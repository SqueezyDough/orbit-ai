const mongoose = require("mongoose");
const Ai = require("../../models/ai.model");
require("dotenv").config();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const utilsController = {};

utilsController.findAi = function(id) {
	mongoose.connect(url,  { useNewUrlParser: true });
	return Ai
			.findOne({ _id: id })
			.then(function(ai) {
				return ai;
		}
	);
};

module.exports = utilsController;