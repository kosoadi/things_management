/*
* class ThingController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Thing = mongoose.model("../models/Thing");
var Category = mongoose.model("../models/Category");
var Developer = mongoose.model("../models/Developer");
var Product = mongoose.model("../models/Product");
var User = mongoose.model("../models/User");
var ObjectId = mongoose.Types.ObjectId;

// method to create/register developer
exports.registerThing = function(req,res,next){
	var new_thing = new Thing({
		_owner: req.params.USERID,
		name: req.body.name,
		location: req.body.location,
		endpoint: req.body.endpoint
	});

	// TO DO validate TOKEN
	new_thing.token = req.body.endpoint; 

	Product
	.findOne({ _name: req.body.type})
	.populate('_creator')
	.populate('category')
	.exec(function(err, prod){
		if(err){
			res.send("Product/Type does not exist");
			throw err;
		}
		new_thing.category = category._name;
		new_thing._product = _creator._id;
		new_thing.type = req.body.type;
		new_thing = validateTypeCategory(new_thing._product);
	});
		
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
				res.send("New thing created: "+new_thing._name+" by "+user._username);		
    		});
    	});
    });
    next();
}

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

exports.editThing = function(req, res, next){
	Thing.findOneAndUpdate({_owner: req.params.USERID, _id:req.params.THINGID}, req.body,
		function(err, thing) {
		if (err){ 
			res.send(err);
			throw err;
		}
		thing.validateTypeCategory(thing._product);
		res.send("Update success Thing:"+thing.name+"@id:"+thing._id);
	});
	next();	
}

exports.deleteThing = function(req, res, next){
	Thing.findOneAndRemove({_owner: req.params.USERID, _id:req.params.THINGID},
		function(err, thing) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Delete success Thing:"+thing.name+"@id:"+thing._id);
	});
	next();	
}