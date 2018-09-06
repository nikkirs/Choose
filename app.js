var express    = require("express"),
	mongoose   = require("mongoose"),
	bodyParser = require("body-parser"),
	passport   = require("passport"),
	localStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User                  = require("./models/user"),
	Questions                  = require("./models/questions"),
	seedDB                   = require("./seeds");
	Comments              = require("./models/comments");

var app = express();
seedDB();




app.use(require("express-session")({
	secret:"I'm nikhil",
	resave:false,
	saveUninitialized:false
}));




mongoose.connect("mongodb://localhost/choose3");







app.set("view engine","ejs");  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})





passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//           HOME
app.get("/",function(req,res){
	res.render("index",{currentUser:req.user});

});


app.get("/all",function(req,res){
	Questions.find({},function(err,questions){
		if(err)
			console.log(err)
		else
			res.render("all",{questions:questions});
	})
})




app.get("/contact",function(req,res){
	res.render("contact");
});







//          Search Page


app.get("/search",function(req,res){
	var firstchoice = req.query.firstchoice;
	var secondchoice = req.query.secondchoice;
	var thirdchoice = req.query.thirdchoice;
	var fourthchoice = req.query.fourthchoice;
	var flike = 0;
	var slike = 0;
	var tlike = 0;
	var frlike = 0;
if(firstchoice==secondchoice){
	res.render("samechoice");
}
else{
Questions.find({fchoice: {$in: [firstchoice, secondchoice]}},function(err,questions){
	for(var i=0;i<questions.length;i++){
		console.log(questions[i])
	}
	if(err){
		handleError(err);
	}

	else if(questions[0]==undefined){
		Questions.create({
	fchoice:firstchoice,
	schoice:secondchoice,
	flike:flike,
	slike:slike,
},function(err,questions){
	if(err)
		console.log(err);
	else{
	res.render("search",{questions:questions});
}
});
	}



	else{
		for(var i=0;i<questions.length;i++){
			var a=questions[i]._id;
console.log(questions.length);
var a;
			Questions.findOne({_id:a,schoice:{$in: [firstchoice, secondchoice]}},a = function(er,question){
			// 			for(var i=0;i<questions.length;i++){
			// console.log(questions[i]);
			// var a=questions[i]._id;
			// console.log(a);

			// 	console.log(questions);
			// 	var k;
		if(er){
			handleError(er);
		}
		else if(question==null){
			k=1;
			return k;
// 					Questions.create({
// 	fchoice:firstchoice,
// 	schoice:secondchoice,
// 	flike:flike,
// 	slike:slike,
// },function(err,questions){
// 	if(err)
// 		console.log(err);
// 	else{

// 	res.render("search",{questions:questions});
// }
// });
		}
		else{
			res.render("search",{questions:question});
		}
			
		});
			console.log(a);
		if(a==1){
					Questions.create({
	fchoice:firstchoice,
	schoice:secondchoice,
	flike:flike,
	slike:slike,
},function(err,questions){
	if(err)
		console.log(err);
	else{

	res.render("search",{questions:questions});
}
});	
}	
		
	

}
}
});
}
});








//             LIKE

app.get("/search/:id/:likeid",isLoggedIn,function(req,res){

	var likeid= req.params.likeid;//   a/b
console.log(likeid);

	Questions.findById(req.params.id,function(err,questions){
		if(err)
			console.log(err);
		else{

			if(likeid=='a'){

			questions.flike=questions.flike+1;
			questions.save();
			res.redirect("/search?firstchoice="+questions.fchoice+"&secondchoice="+questions.schoice);
		}else{
			questions.slike=questions.slike+1;
			questions.save();
			res.redirect("/search?firstchoice="+questions.fchoice+"&secondchoice="+questions.schoice);
		}
		}
	})
});


























//              COMMENTS



app.get("/all/:id/comments/new/:commentid",function(req,res){
	var commentid = req.params.commentid;
	Questions.findById(req.params.id,function(err,questions){
		if(err)
			console.log(err)
		else{
			console.log(questions);
			res.render("new",{questions:questions,commentid:commentid});
		}
	})
});


app.post("/all/:id/comments/:commentid",function(req,res){
	Questions.findById(req.params.id,function(err,questions){
		if(err)
			console.log(err);
		else{
			Comments.create(req.body.comment,function(er,comment){
				if(er)
					console.log(er)
				else if(req.params.commentid==1){
questions.fcomments.push(comment);
					questions.save();
					res.redirect("/comments/"+questions._id+"/"+req.params.commentid);

				}
				else if(req.params.commentid==2){
					questions.scomments.push(comment);
					questions.save();
					res.redirect("/comments/"+questions._id+"/"+req.params.commentid);

				}
			})
		}
	})
})


app.get("/comments/:id/:commentid",function(req,res){
var commentid = req.params.commentid;
	if(commentid==1){
	Questions.findById(req.params.id).populate("fcomments").exec(function(err,questions){
		if(err)
			console.log(err)
		else{
			res.render("more",{questions:questions,commentid:commentid});
		}
	})
}else{
	Questions.findById(req.params.id).populate("scomments").exec(function(err,questions){
		if(err)
			console.log(err)
		else{

				res.render("more",{questions:questions,commentid:commentid});
		}
	})
}

});
















//                         AUTHENTICATION


app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	req.body.username;
	req.body.password;
	User.register(newUser,req.body.password,function(er,user){
		if(er){
			console.log(er);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect('/');
		});
	});
});
app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login",passport.authenticate("local",{
		successRedirect:"/",
		failureRedirect:"/login"
	}),function(req,res){
})
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
		res.render("notlogged");
	
}













//              LISTEN


app.listen(3000,function(){
	console.log("server is running");

});