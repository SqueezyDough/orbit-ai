const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// fix deprecation warning
mongoose.set("useCreateIndex", true);

let OrbitSchema = new Schema({
	ownerId : {
		type: String
	},
	// linked ais
	planets : {
		type : Array
	},
	// connected ais
	activeConnections : {
		type : Array
	}
});

module.exports = mongoose.model("Orbit", OrbitSchema);