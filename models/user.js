const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		required: true,
	},
});

userSchema.pre("save", async function (next) {
	const user = this;
	const hash = await bcrypt.hash(this.password, 10);

	this.password = hash;
	next();
});

userSchema.methods.isValidPassword = async function(password) {
   const user = this;
   const compare = await bcrypt.compare(password, user.password);
 
   return compare;
 }

const User = mongoose.model("user", userSchema);
module.exports = User;
