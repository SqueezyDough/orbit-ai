const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const Ai = require("../models/ai.model");

require("dotenv").config();

passport.use(new LocalStrategy({
	usernameField: "serialNr",
	passwordField: "password",
	},
	function(serialNr, password, done) {
		Ai.findOne({ serialNr: serialNr }, function (err, ai) {
			if (err) { return done(err); }
			if (!ai) {
			return done(null, false, { message: "Incorrect username." });
			}
			bcrypt.compare(password, ai.password, function(err, authSucces){
                if(err) throw err;
                if(authSucces){
                    return done(null, ai.id);
                }else{
                    return done(null, false, {message: "Wrong password"});
                }
            });
		});
	}
));

passport.serializeUser(function(ai_id, done) {
	done(null, ai_id);
});

passport.deserializeUser(function(ai_id, done) {
	done(null, ai_id);
});

module.exports = passport;