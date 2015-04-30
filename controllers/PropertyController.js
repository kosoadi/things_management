/*
* class PropertyController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Property = mongoose.model("../models/Property");
var Thing = mongoose.model("../models/Thing");
var Category = mongoose.model("../models/Category");
var Developer = mongoose.model("../models/Developer");
var Product = mongoose.model("../models/Product");
var User = mongoose.model("../models/User");
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
	var properties = JSON.parse(req.body.properties);

	Thing.findOne({_owner: userid, _id:thingid}, function(err, thing){
		if (err){ 
			res.send(err);
			throw err;
		}
		for(var p in properties){
			new_property = new Property({
				_thingid: thingid,
				_name: properties[p].name,
				access: properties[p].access,
				control: properties[p].control,
				valueType: properties[p].valueType,
				description: properties[p].description
			});

			new_property.save(function(err){
				if(err){
					res.send("Invalid properties definition");
					throw err;
				}
				thing.properties.push(new_property);
			});
		}
		
		thing.save(function(err){
			if(err){
				Property.find({_thingid: thing._id}).remove();
				res.send(err);
				throw err;
			}
			res.send("Properties added");
		});		
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
				res.send("Delete success Property:"+prop._name+"@id:"+prop._id);
		});
	});
	next();	
}