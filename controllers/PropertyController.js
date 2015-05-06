/*
* class PropertyController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Property = require("../models/Property");
var Thing = require("../models/Thing");
var Category = require("../models/Category");
var Developer = require("../models/Developer");
var Product = require("../models/Product");
var User = require("../models/User");
var ObjectId = mongoose.Types.ObjectId;

// method to create/register a property
/*
	param: USERID, THINGID
	body:
	{
		properties: [Object JSON]
	}
*/
exports.registerProperty = function(req,res,next){
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;
	var properties = req.body.properties;

	Thing.findOne({_owner: userid, _id:thingid}, function(err, thing){
		if (err){ 
			res.send(err);
			throw err;
		}
		for(var i=0; i<properties.length; i++){
			var temp = properties[p].name.replace(/\s/g,'');
			var name = temp.toLowerCase();
			new_property = new Property({
				_thingid: thingid,
				_name: name,
				access: properties[p].access,
				control: properties[p].control,
				valueType: properties[p].valueType,
				description: properties[p].description,
				min: properties[p].min,
				max: properties[p].max
			});
			new_property.save(function(err){
				if(err){
					res.send("Invalid properties definition");
					throw err;
				}
				thing.properties.push(new_property);
				thing.save(function(err){
					if(err){
						Property.find({_thingid: thing._id, _id:new_property._id}).remove();
						res.send(err);
						throw err;
					}
					res.send("Properties added");
				});
			});
		}
		next();
	});
	next();
}

// method to get user property
/*
	param: USERID, THINGID, PROPNAME
*/
exports.getUserProperty = function(req, res, next){
	Thing.findOne({_owner: req.params.USERID, _id:req.params.THINGID}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		Property.findOne({_thingid:thing._id, _name:req.params.PROPNAME}, function(err, props){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(props);
		});
	});
	next();		
}

// method to get user properties
/*
	param: USERID, THINGID
*/
exports.getAllUserProperty = function(req, res, next){
	Thing.findOne({_owner: req.params.USERID, _id:req.params.THINGID}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		Property.find({_thingid:thing._id}, function(err, props){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(props);
		});
	});
	next();	
}

// method to get all properties
/*
	param: no
*/
exports.getAllProperty = function(req, res, next){
	Property.find({}, function(err, props){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(props);
	});
	next();	
}

// method to edit a property
/*
	param: USERID, THINGID, PROPNAME
	body:
	{
		_name: {type: String, required: true}, // No space allowed
		access: Boolean,
		control: Boolean,
		valueType: String, // STR | INT | DBL | BOOL | ARR | OBJ
		description: String
	}
*/
exports.editProperty = function(req, res, next){
	Thing.findOne({_owner: req.params.USERID, _id:req.params.THINGID}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		Property.findOneAndUpdate({_thingid: thing._id, _name:req.params.PROPNAME}, req.body,
			function(err, prop) {
				if (err){ 
					res.send(err);
					throw err;
				}
				res.send("Update success Property:"+prop._name+"@id:"+prop._id);
		});
	});
	next();	
}

// method to delete a property
/*
	param: USERID, THINGID, PROPNAME
	body: no
*/
exports.deleteProperty = function(req, res, next){
	Thing.findOne({_owner: req.params.USERID, _id:req.params.THINGID}, function(err, thing){
		if(err){
			res.send(err);
			throw err;
		}
		Property.findOneAndRemove({_thingid: thing._id, _name:req.params.PROPNAME},
			function(err, prop) {
				if (err){ 
					res.send(err);
					throw err;
				}
				var index = thing.properties.indexOf(prop._id);
				thing.properties.splice(index, 1);
				thing.save(function(err){
					if (err){
						res.send(err);
						throw err;
					}
					res.send("Delete success Property:"+prop._name+"@"+thing.name);
				});
		});
	});
	next();	
}

// method to get a property value
/*
	param: USERID, THINGID, PROPNAME
	body: no
*/
exports.getPropertyValue = function(req, res, next){
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;
	var name = req.params.PROPNAME;

	Property.findOne({_thingid:thingid, _name:name}, function(err, prop){
		if(err){
			res.send("Property not found");
			throw err;
		}
		Thing.findOne({_id: prop._thingid}, function(err, thing){
			if(err){
				res.send(err);
				throw err;
			}
			if(thing.type == "lifx" && thing.category == "light"){
				
			}		
		});
	});
	next();
}

// method to set a property value
/*
	param: USERID, THINGID, PROPNAME
	body:
	{
		value: Object (of various types)
	}
*/
exports.setPropertyValue = function(req, res, next){
	next();
}