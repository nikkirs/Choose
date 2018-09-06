var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	questions:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Questions"
	}
	]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);