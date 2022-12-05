const User = require("../models/user");
const jwt = require("jsonwebtoken");

function home(req, res) {
	return res.status(200).json({
		message: "Home page of Access system",
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
						return res.redirect("/login");
					}
					const token = genToken(user);
					return res.status(200).json({ token });
				});
			} else {
				return res.redirect("/login");
			}
		}
	);
}

async function addMember(req, res) {
	if (req.user.isAdmin) {
		const user = await User.findOne({
			email: req.body.email,
		});
		if (user) {
			return res.status(403).json({
				message: "User Already exist",
			});
		} else {
			await User.create({
				user: req.body.user,
				email: req.body.email,
				password: req.body.password,
				isAdmin: req.body.isAdmin,
			});
			return res.status(200).json({
				message: "User created Successfully",
			});
		}
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

async function getMembers(req, res) {
	const user = await User.find();
	return res.status(200).json({
		users: user,
	});
}
async function dashboard(req, res) {
	console.log(req.user);
	const user = await User.findById(req.user.id);
	return res.status(200).json({
		"Your dashboard": user,
	});
}
function billing(req, res) {
	return res.status(200).json({
		billing: "Dummy data",
	});
}

module.exports = {
	home,
	createUser,
	addMember,
	login,
	getMembers,
	dashboard,
	billing,
};
