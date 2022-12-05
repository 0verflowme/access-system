const mongoose = require("mongoose");
mongoose.connect(
	"mongodb+srv://0verflowme:9A6YjzxS7NTYyC3b@cluster0.ghy5nv0.mongodb.net/accesssystem"
);

const db = mongoose.connection;

db.on("err", console.error.bind(console, "Connection Error"));
db.once("open", () => {
	console.info("Connection to db Successful :: Mongodb");
});
