const User = require("../models/user");
const jwt = require("jsonwebtoken");

function home(req, res) {
	console.log(req.body);
	return res.status(200).json({
		message: "hello",
	});
}

genToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			iss: "access_system",
			sub: user.id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1),
		},
		"dummyKey"
	);
};

function createUser(req, res) {
	if (req.body.password !== req.body.confirm_password) {
		return res.redirect("back");
	}
	User.findOne(
		{
			email: req.body.email,
		},
		(err, user) => {
			if (err) {
				console.err("Something went wrong");
				return;
			}
			if (!user) {
				User.create(req.body, (err, user) => {
					if (err) {
						console.log("Cannot create user", err);
						return res.redirect("/signin");
					}
					const token = genToken(user);
					return res.status(200).json({ token });
				});
			} else {
				return res.redirect("/signin");
			}
		}
	);
}

function addMember(req, res) {
	if (req.user.isAdmin) {
		return res.status(200).json({
			message: "Authed",
		});
	}
}
async function login(req, res) {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email });
	if (user && (await user.isValidPassword(password))) {
		const token = genToken(user);
		return res.status(200).json({ token });
	} else {
		return res.status(200).json({
			message: "Invalid User/Password",
		});
	}
}

module.exports = {
	home,
	createUser,
	addMember,
	login,
};
