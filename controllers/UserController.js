// http://code.tutsplus.com/tutorials/restful-api-design-with-nodejs-restify--cms-22637
/*
* class UserController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var User = require("../models/User");
var Thing = require("../models/Thing");
var ObjectId = mongoose.Types.ObjectId;

// method to regUserserrequire
/*
	param: no
	body:
	{
		email: String,
		name: String
	}
*/
exports.registerUser = function(req,res,next){
	var new_user = new User({
		_email: req.body.email,
		name: req.body.name,
		status: true,
		things: []
	});
	new_user.save(function(err){
		if (err){
			res.send(err);
			throw err;
		}
		res.send("New user registered: "+ new_user._email + " @ "+ new_user.name);
	});
	next();
}

// method to get a user
/*
	param: USERID
	body: no
*/
exports.getUser = function(req, res, next){
	User.findById(req.params.USERID, function(err, user) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(user);
	});
	next();	
}

// method to get all users
/*
	param: no
	body: no
*/
exports.getAllUser = function(req, res, next){
	User.find({}, function(err, users) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(users);
	});
	next();	
}

exports.removeUser = function(req, res, next){
	User.findOneAndUpdate( {_id:req.params.USERID}, {status:false},
		function(err, user) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Successfully changed status to INACTIVE user:"+user._email+"@id:"+user._id);
	});
	next();	
}

// method to edit a user
/*
	param: USERID
	body:
	{
		_username: String,
		name: String,
		password: String,
		image: String,
	}
*/
exports.editUser = function(req, res, next){
	User.findOneAndUpdate( {_id:req.params.USERID}, req.body,
		function(err, user) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Update success user:"+user._email+"@id:"+user._id);
	});
	next();	
}

// method to delete a user
/*
	param: USERID
	body: no
*/
exports.deleteUser = function(req, res, next){
	User.findOneAndRemove( {_id:req.params.USERID},function(err, user) {
		if (err){ 
			res.send(err);
			throw err;
		}
		Thing.find({_owner:req.params.USERID}).remove(function(err){
			if (err){ 
				res.send(err);
				throw err;
			}
			res.send("Delete success user:"+user.name+"@id:"+user._id);
		});
	});
	next();	
}