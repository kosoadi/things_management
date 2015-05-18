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

// method to create/register thing
/*
	param: USERID
	body:
	{
		name: String,
		location: String,
		endpoint: String,
		token: String,
		prodid: ObjectId of Product
	}
*/
exports.registerThing = function(req,res,next){
	var new_thing = new Thing({
		_owner: req.params.USERID,
		name: req.body.name,
		location: req.body.location,
		endpoint: req.body.endpoint,
		token: req.body.token
	});

	// TO DO validate TOKEN

	Product
	.findOne({ _id: req.body.prodid}, function(err, prod){
		if(err){
			res.send("Product/Type does not exist");
			throw err;
		}
		new_thing._product = prod._id;
		new_thing.type = prod._name;
		new_thing.category = prod.category._name;

		new_thing.save(function(err){
    		if(err){
				res.send(err);
				throw err;
			}
    		User.findOne({_id: new_thing._owner}, function(err, user){
    			if(err){
					res.send(err);
					throw err;
				}
				user.things.push(new_thing);	
    			user.save(function(err){
    				if(err){
						res.send(err);
						throw err;
					}
					res.send("New thing created: "+new_thing.name+" by "+user._username);		
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