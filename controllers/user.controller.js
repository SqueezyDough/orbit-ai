const mongoose = require("mongoose");
const schema = require("../models/user.model").UserSchema;
// eslint-disable-next-line no-unused-vars
const bodyParser = require("body-parser");

require("dotenv").config();

// conn string
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

exports.user_create = function (req, res) {

    mongoose.connect(url,  { useNewUrlParser: true }).then(
        () => {
          //construct model
          let UserSchema = mongoose.model("User", schema);

          // create new instance of user
          let user = new UserSchema({
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname,
            birthdate: new Date(req.body.birthdate),
            gender: req.body.gender,
            sexualPreference: req.body.sexualPreference
          });

          user.save(function (err) {
            if (err) {
                return next(err);
            }
          });

          res.send("User created successfully");
        },
        err => { console.log(err); }
      );

}