/* eslint-disable no-console */
const mongoose = require("mongoose");
const schema = require("../models/user.model").UserSchema;

require("dotenv").config();

// conn string
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

exports.user_join = function (req, res) {
    res.render("pages/join", {
        title: "Join"
    });
};

// create
exports.user_create = function (req, res) {
    mongoose.connect(url,  { useNewUrlParser: true }).then(
        () => {
            //construct model
            let UserSchema = mongoose.model("User", schema);

            // create new instance of user
            let user = new UserSchema({
                email: req.body.email,
                password: req.body.password,
                fullName: req.body.fullName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthdate: new Date(req.body.birthdate),
                gender: req.body.gender,
                sexualPreference: req.body.sexualPreference
            });

            // save user
            user.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`User created: \n ${user}`);
                    res.send(`User created: \n ${user}`);
                }
            });
        },
        err => { console.log(err); }
    );
};