const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const Schema = mongoose.Schema,
    bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10;

// fix deprecation warning
mongoose.set("useCreateIndex", true);

let AiSchema = new Schema({
    serialNr: {
        type: String,
        required: [true, "Field is required"],
        index: true,
        unique: [true, "Serial nr already exists"],
		uniqueCaseInsensitive: true,
		trim: true
    },
    password: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: [true, "Field is required"],
        max: [100, "Model name must be below 100 characters"]
    },
    instanceName: {
        type: String,
        required: [true, "Field is required"],
        max: [100, "Last name must be below 100 characters"]
    },
    constructionDate: {
        type: Date,
        required: [true, "Field is required"]
    },
    gender: {
        type: String,
        required: [true, "Field is required"]
	},
	properties : {
		intelligence: {
			type: Number,
		},
		environment: {
			type: String
		},
		shape: {
			type: String
		},
		abilities: {
			type: Array
		},
	},
	avatarUrl: {
        type: String,
	},
    orbits: {
		type : Array
    }
});

// Virtual property for fullname. This won't be stored in MongoDB
AiSchema.virtual("brandModel")
    // get concatenated first and last name
    .get(function () { return `${this.brandName} - ${this.instanceName}`; })

    // set first and last name from fullname
    .set(function (brandModel) {
        this.brandName = brandModel.substr(0, brandModel.indexOf(" "));
        this.instanceName = brandModel.substr(brandModel.indexOf(" ") + 1);
	});

// validate serial nr
AiSchema.plugin(beautifyUnique, { message: "Error, expected {PATH} to be unique." });

// authentication
AiSchema.plugin(passportLocalMongoose);

// Hash password
AiSchema.pre("save", function (next) {
    var ai = this;

    // only hash the password if it has been modified (or is new)
    if (!ai.isModified("password")) return next();

    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with the new salt
        bcrypt.hash(ai.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the plain password with the hashed one
            ai.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("Ai", AiSchema);