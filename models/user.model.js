const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema,
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

// fix deprecation warning
mongoose.set("useCreateIndex", true);

let UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Field is required"],
        index: true,
        unique: [true, "Email already exists"],
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: [true, "Field is required"],
        max: [100, "First name must be below 100 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Field is required"],
        max: [100, "Last name must be below 100 characters"]
    },
    birthdate: {
        type: Date,
        required: [true, "Field is required"]
    },
    gender: {
        type: String,
        required: [true, "Field is required"]
    },
    sexualPreference: {
        type: String,
        required: [true, "Field is required"]
    },
    avatarUrl: {
        type: String,
    },
    description: {
        type: String
    },
    hobbies: {
        type: Array
    },
    privateImages: {
        type: Array
    },
    publicImages: {
        type: Array
    },
    matches: {
        type: Array
    }
}, { autoCreate: true }); // autocreate: create the underlying collections

// Virtual property for fullname. This won't be stored in MongoDB
UserSchema.virtual("fullname")
    // get concatenated first and last name
    .get(function () { return `${this.firstName} ${this.lastName}`; })

    // set first and last name from fullname
    .set(function (fullname) {
        this.firstName = fullname.substr(0, fullname.indexOf(" "));
        this.lastName = fullname.substr(fullname.indexOf(" ") + 1);
    });

// validate email
UserSchema.plugin(uniqueValidator, { message: "Error, expected {PATH} to be unique." });

// Hash password
UserSchema.pre("save", function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with the new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the plain password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// compare user input with hashed password
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb (null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);