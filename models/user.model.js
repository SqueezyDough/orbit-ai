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
    prefix: {
        type: String,
        required: false,
        max: 30
    },
    birthdate: {
        type: Date,
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
}, { autoCreate: true, capped: 1024 }); // autocreate: create the underlying collections

// Virtual property for fullname. This won't be stored in MongoDB
UserSchema.virtual('fullname')
    // get concatenated first and last name
    .get(function () { return `${this.firstName} ${this.prefix} ${this.lastName}` })

    // set first and last name from fullname
    .set(function (fullname) {
        this.firstName = fullname.substr(0, fullname.indexOf(' '));
        this.lastName = fullname.substr(fullname.indexOf(' ') + 1);
    });

module.exports = mongoose.model('User', UserSchema);