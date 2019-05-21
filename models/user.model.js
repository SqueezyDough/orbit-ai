const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        max: 100
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    sexualPreference: {
        type: String,
        required: true
    },
});

// Virtual property for fullname. This won't be stored in MongoDB
UserSchema.virtual('fullname')
    // get concatenated first and last name
    .get(function () { return `${this.firstName} ${this.lastName}` })
    // set first and last name from fullname
    .set(function (fullname) {
        this.firstName = fullname.substr(0, fullname.indexOf(' '));
        this.lastName = fullname.substr(fullname.indexOf(' ') + 1);
    });

module.exports = mongoose.model('User', UserSchema);