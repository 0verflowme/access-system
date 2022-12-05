const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const passport = require("passport");
const passportjwt = require("../config/passport-jwt-strategy");

// router.use(express.json());

router.post("/", controller.home);
router.post("/signup", controller.createUser);
router.get(
	"/addMember",
	passport.authenticate("jwt", { session: false }),
	controller.addMember
);
router.post("/login", controller.login);

module.exports = router;
