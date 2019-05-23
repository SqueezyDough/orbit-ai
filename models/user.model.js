const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Field is required'],
        index: true,
        unique: [true, 'Email already exists']
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'Field is required'],
        max: [100, 'First name must be below 100 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Field is required'],
        max: [100, 'Last name must be below 100 characters']
    },
    birthdate: {
        type: Date,
        required: [true, 'Field is required']
    },
    gender: {
        type: String,
        required: [true, 'Field is required']
    },
    sexualPreference: {
        type: String,
        required: [true, 'Field is required']
    },
    avatarUrl: {
        type: String,
    },
    description: {
        type: String
    },
    hobbies: {
        type: []
    },
    images: {
        type: []
    }
}, { autoCreate: true }); // autocreate: create the underlying collections

// Virtual property for fullname. This won't be stored in MongoDB
UserSchema.virtual('fullname')
    // get concatenated first and last name
    .get(function () { return `${this.firstName} ${this.prefix} ${this.lastName}` })

    // set first and last name from fullname
    .set(function (fullname) {
        this.firstName = fullname.substr(0, fullname.indexOf(' '));
        this.lastName = fullname.substr(fullname.indexOf(' ') + 1);
    });

UserSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', UserSchema);