var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
	fchoice:String,
	schoice:String,
	tchoice:String,
	frchoice:String,
	flike:Number,
	slike:Number,
	tlike:Number,
	frlike:Number,
	fcomments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comments"
	}
	],
	scomments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comments"
	}
	],
	tcomments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comments"
	}
	],
	frcomments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comments"
	}
	]

});

module.exports = mongoose.model("Questions",questionSchema);  

