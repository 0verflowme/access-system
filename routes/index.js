const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const passport = require("passport");
const passportjwt = require("../config/passport-jwt-strategy");

router.post("/", controller.home);
router.post("/signup", controller.createUser);
router.post(
	"/addMember",
	passport.authenticate("jwt", { session: false }),
	controller.addMember
);
router.get(
	"/addMember",
	passport.authenticate("jwt", { session: false }),
	controller.getMembers
);
router.post("/login", controller.login);
router.get(
	"/dashboard",
	passport.authenticate("jwt", { session: false }),
	controller.dashboard
);
router.get(
	"/billing",
	passport.authenticate("jwt", { session: false }),
	controller.billing
);

module.exports = router;
