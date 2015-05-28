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
var mqtt = require('mqtt');

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
		var temp = req.body.name.replace(/\s/g,'');
        var name = temp.toLowerCase();
        new_property = new Property({
            _thingid: thingid,
            _name: name,
            access: {state:req.body.access},
            control: {state:req.body.control},
            valueType: req.body.valueType,
            description: req.body.description,
            min: req.body.min,
            max: req.body.max,
         	topic:{ 
         		setter:'sot/'+userid+'/'+thing.category+'/'+thingid+'/'+name+'/ctl',
         		getter:'sot/'+userid+'/'+thing.category+'/'+thingid+'/'+name+'/acc'
         	}
        });
		
		if(req.body.access.hasOwnProperty('func')){
			new_property.access.func = req.body.access.func;
		};

		if(req.body.control.hasOwnProperty('func')){
			new_property.control.func = req.body.control.func;
		};

			new_property.save(function(err, prop){
				if(err){
					res.send(err);
					throw err;
				}
				thing.properties.push(new_property);
				thing.save(function(err){
					if(err){
						Property.find({_thingid: thing._id, _id:prop._id}).remove();
						res.send(err);
						throw err;
					}
					res.send("Property added: "+prop._name+"@"+thing.name);
					next();
				});
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
			res.send(err);
			throw err;
		}
		if(!prop){
			var error = new Error("Property, Thing, or User not found");
			res.send(error);
			throw error;
		}
		Thing.findOne({_id: prop._thingid, _owner:userid}, function(err, thing){
			if(err){
				res.send(err);
				throw err;
			}
			if(!thing){
				var error = new Error("Property, Thing, or User not found");
				res.send(error);
				throw error;
			}

			if(prop.access.state == true){
				if(typeof prop.access.func != 'undefined'){
					prop.access.func(function(err, data){
						if(err){
							res.send(err);
							throw err;
						}
						res.send(data); next();
					});
				}
				var client = mqtt.connect("LINK uri mosquitto");
				client.on('connect', function () {
  					client.subscribe(thing.topic.getter);
				});
				client.on('message', function (topic, message) {
  					client.end();
					res.send(message.toString());
				});
			}else{
				var error = new Error("Invalid command");
				res.send(error);
				throw error;
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
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;
	var name = req.params.PROPNAME;
	var input = req.body.input;
	Property.findOne({_thingid:thingid, _name:name}, function(err, prop){
		if(err){
			res.send(err);
			throw err;
		}
		if(!prop){
			var error = new Error("Property, Thing, or User not found");
			res.send(error);
			throw error;
		}
		Thing.findOne({_id: prop._thingid, _owner:userid}, function(err, thing){
			if(err){
				res.send(err);
				throw err;
			}
			if(!thing){
				var error = new Error("Property, Thing, or User not found");
				res.send(error);
				throw error;
			}
			if(prop.control.state == true){
				if(prop.valueType == "INT"){
					input = parseInt(input);
					if(prop.min<input && input<prop.max){
						var error = new Error("Invalid input");
						res.send(error);
						throw error; next();			
					}
				}else if(prop.valueType == "DBL"){
					if(prop.min<input && input<prop.max){
						var error = new Error("Invalid input");
						res.send(error);
						throw error; next();			
					}
				}
				if(typeof prop.control.func != 'undefined'){
					prop.control.func(input, function(err, data){
						if(err){
							res.send(err);
							throw err;
						}
						res.send(data);
						next();
					});
				}

				var client = mqtt.connect("LINK uri mosquitto");
				client.on('connect', function () {
  					client.publish(thing.topic.setter, input+"");
  					client.end();
  					res.send("Published topic:"+ thing.topic.setter+":"+input);
				});
			}else{
				var error = new Error("Invalid command");
				res.send(error);
				throw error;
			}		
		});
	});
	next();
}
