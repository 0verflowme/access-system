const User = require("../models/user");
const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: "dummyKey",
};
passport.use(
	new JWTStrategy(opts, (jwt_payload, done) => {
		// console.log(jwt_payload);
		User.findById(jwt_payload._id, (err, user) => {
			if (err) {
				console.log(err);
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		if (err) {
			console.log("Error in deserializing th user");
			return done(err);
		}
		return done(null, user);
	});
});

passport.checkAuthentication = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/signin");
};

passport.checkAuthenticationSignin = function (req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/dashboard");
	}
	return next();
};

passport.setAuthenticatedUser = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
	}
	next();
};

module.exports = passport;
