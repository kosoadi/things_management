/*
* class ThingController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Thing = require("../models/Thing");
var Category = require("../models/Category");
var Developer = require("../models/Developer");
var Product = require("../models/Product");
var Property = require("../models/Property");
var User = require("../models/User");
var ObjectId = mongoose.Types.ObjectId;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = '12345678901234567890123456789012';

// method to create/register thing
/*
	param: USERID
	body:
	{
		name: String,
		location: String,
		token: String
	}
*/
exports.registerThing = function(req,res,next){
	var new_thing = new Thing({
		_owner: req.params.USERID,
		name: req.body.name
	});
	
	if(!req.body.hasOwnProperty('location')){
		new_thing.location = "";
	} else new_thing.location = req.body.location;

	var decipher = crypto.createDecipher(algorithm,password)
  	var dec = decipher.update(req.body.token,'hex','utf8')
  	dec += decipher.final('utf8');

  	var first = dec.substring(8, 16);
	var mid1 = dec.substring(20, 24);
	var mid2 = dec.substring(28, 32);
	var mid3 = dec.substring(36, 40);
	var end = dec.substring(52, 64);
	var text = first+"-"+mid1+"-"+mid2+"-"+mid3+"-"+end;
	
	Product
	.findOne({ token: text}, function(err, prod){
		if(err){
			res.send(err);
			throw err;
		}
		if(!prod){
			var error = new Error("Invalid Token");
			throw error;
		}
		new_thing.token = req.body.token;	
		new_thing._product = prod._id;
		new_thing.type = prod._name;
		new_thing.category = prod.category._name;
		new_thing.save(function(err, thing){
    		if(err){
				res.send(err);
				throw err;
			}
    		User.findOne({_id: new_thing._owner}, function(err, user){
    			if(err){
					res.send(err);
					throw err;
				}
				if(!user){
					var error = new Error("User not found");
					res.send(error);
					throw error;
				}
				user.things.push(thing);	
    			user.save(function(err){
    				if(err){
						res.send(err);
						throw err;
					}
					var out = {
						message: "New thing created: "+thing.name+" by "+user._username,
						id: thing._id
					};
					res.send(out);		
    				next();
    			});
    		});
    	});
		
	});
}


// method to get a thing of a user
/*
	param: USERID, THINGID
	body: no
*/
exports.getUserThing = function(req, res, next){
	Thing.findOne({_owner: req.params.USERID, _id:req.params.THINGID}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(thing);
	});
	next();	
}

// method to get all things of a user
/*
	param: USERID
	body: no
*/
exports.getAllUserThing = function(req, res, next){
	Thing.find({_owner: req.params.USERID}, function(err, things){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(things);
	});
	next();	
}

// method to get all things
/*
	param: no
	body: no
*/
exports.getAllThing = function(req, res, next){
	Thing.find({}, function(err, things) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(things);
	});
	next();	
}

// method to edit a user's thing
/*
	param: USERID, THINGID
	body:
	{
		name: String,
		location: String,
		endpoint: String,
		token: String
	}
*/
exports.editThing = function(req, res, next){
	Thing.findOneAndUpdate({_owner: req.params.USERID, _id:req.params.THINGID}, req.body,
		function(err, thing) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Update success Thing:"+thing.name+"@id:"+thing._id);
	});
	next();	
}

// method to delete a user's thing
/*
	param: USERID, THINGID
	body: no
*/
exports.deleteThing = function(req, res, next){
	Thing.findOneAndRemove({_owner: req.params.USERID, _id:req.params.THINGID},
		function(err, thing) {
		if (err){ 
			res.send(err);
			throw err;
		}
		Property.find({_thingid: thing._id}).remove(function(err){
			if (err){ 
				res.send(err);
				throw err;
			}
			User.findOne({_id: req.params.USERID}, function(err, user){
				if (err){ 
					res.send(err);
					throw err;
				}	
				var index = user.things.indexOf(thing._id);
				user.things.splice(index, 1);
				user.save(function(err){
					if (err){
						res.send(err);
						throw err;
					}
					res.send("Delete success Thing:"+thing.name+"@: "+user.name);
				});
			});	
		});
	});
	next();
}

// method to request accept
/*
	params: THINGTOKEN
	body: no
*/
exports.requestAccess = function(req, res, next){
	Thing.findOne({token: req.params.THINGTOKEN}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		var out = {
			user: thing._owner,
			thing: thing._id
		};
		res.send(out);
	});
	next();	
}