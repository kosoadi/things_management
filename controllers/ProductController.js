/*
* class ProductController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Product = require("../models/Product");
var Developer = require("../models/Developer");
var Category = require("../models/Category");
var Thing = require("../models/Thing");
var Property = require("../models/Property");
var User = require("../models/User");
var ObjectId = mongoose.Types.ObjectId;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = '12345678901234567890123456789012';
var uuid = require('node-uuid');
var request = require('request');
// method to create/register developer
/*
	param: DEVID
	body:
	{
		name: String,
		categoryid: ObjectId,
		image: String URI
	}
*/
exports.registerProduct = function(req,res,next){
	Developer.findById(req.params.DEVID, function(err, dev) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(!dev){
			var error = new Error("Developer not found");
			res.send(error);
			throw error;
		}
		var new_product = new Product({
			_creator: dev._id,
			_name: req.body.name,		
			category: req.body.categoryid, 
			description: req.body.description,
			properties:[],
			token: uuid.v4()
		});
			
		if(!req.body.hasOwnProperty('image')){
			new_product.image = "SET DEFAULT IMAGE URI";
		} else new_product.image = req.body.image;

		if(req.body.hasOwnProperty('token_auth')){
			new_product.token_auth = req.body.token_auth;
		};

		if(req.body.hasOwnProperty('discover_thing')){
			new_product.discover_thing = req.body.discover_thing;
		};

		if(req.body.hasOwnProperty('scheme')){
			new_product.scheme = req.body.scheme;
		};

    	new_product.save(function(err, prod){
    		if(err){
				res.send(err);
				throw err;
			}
			dev.products.push(prod);	
    		dev.save(function(err){
    			if(err){
					res.send(err);
					throw err;
				}
				var out = {
					message: "New product created: "+prod._name+" by "+dev.name,
					token: prod.token
				};
				res.send(out);		
    		});
    	});
	});
	next();
}

// method to get a product of a developer
/*
	param: DEVID, PRODID
	body: no
*/
exports.getDeveloperProduct = function(req, res, next){
	Product.findOne({_creator: req.params.DEVID, _id:req.params.PRODID}, function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(prod);
	});
	next();	
}

// method to generate tokens of a product of a developer
/*
	param: DEVID, PRODID, SIZE
	body: no
*/
exports.getThingTokens = function(req, res, next){
	Product.findOne({_creator: req.params.DEVID, _id:req.params.PRODID}, function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(!prod){
			var error = new Error("Product or Developer not found");
			res.send(error);
			throw error;
		}
		prod.generateToken(parseInt(req.params.SIZE,10), function(err, tokens){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(tokens);
			next();
		});
	});
	next();	
}

// method to generate 1 token of a product of a developer
/*
	param: :PRODTOKEN
	body: no
*/
exports.getOneToken = function(req, res, next){
	Product.findOne({token: req.params.PRODTOKEN}, function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(!prod){
			var error = new Error("Invalid Token");
			res.send(error);
			throw error;
		}
		prod.generateToken(1, function(err, token){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(token);
			next();
		});
	});
	next();	
}


// method to get all products by a developer
/*
	param: DEVID
	body: no
*/
exports.getAllDeveloperProduct = function(req, res, next){
	Product.find({_creator: req.params.DEVID}, function(err, prods){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(prods);
	});
	next();	
}

// method to get all product
/*
	param: no
	body: no
*/
exports.getAllProduct = function(req, res, next){
	Product.find({}, function(err, prods) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(prods);
	});
	next();	
}

// method to edit product
/*
	param: DEVID, PRODID
	body:
	{
		_name: String,
		properties: [Object], //Array of JSON Objects containing properties definition
		token: String,
		image: String
	}
*/
exports.editProduct = function(req, res, next){
	Product.findOneAndUpdate( {_creator:req.params.DEVID, _id:req.params.PRODID}, req.body,
		function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Update success Product:"+prod._name+"@id:"+prod._id);
	});
	next();	
}

// method to delete product
/*
	param: DEVID, PRODID
	body: no
*/
exports.deleteProduct = function(req, res, next){
	Product.findOneAndRemove( {_creator:req.params.DEVID, _id:req.params.PRODID},
		function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		Thing.find({_product: prod._id}, function(err, things){
			if (err){ 
				res.send(err);
				throw err;
			}
			for(var i=0; i<things.length; i++){
				things[i].remove(function(err){
					if (err){ 
						res.send(err);
						throw err;
					}
					User.find({_id: things[i]._owner}, function(err, user){
						var index = user.things.indexOf(things[i]._owner);
						user.things.splice(index, 1);
						user.save(function(err){
							if (err){
								res.send(err);
								throw err;
							}
							Property.find({_thingid: things[i]._id}).remove(function(err){
								if (err){ 
									res.send(err);
									throw err;
								}	
							});	
						});
					});	
				});
			}
			Developer.findOne({_id: req.params.DEVID}, function(err, dev){
				if (err){ 
					res.send(err);
					throw err;
				}	
				var index = dev.products.indexOf(prod._id);
				dev.products.splice(index, 1);
				dev.save(function(err){
					if (err){
						res.send(err);
						throw err;
					}
					res.send("Delete success Product:"+prod.name+"@"+dev.name);
				});
			});	
		});
	});
	next();	
}

// method to add property to a product
/*
	param: DEVID, PRODID
	body:
	{
		look example below
	}
	eg. {
			
			name: "hue", 
			access: true, 
			control: true, 
			valueType: "NUM",
			description:"variable for hue of lighting"
			min: "0",
			max: "1"
		}
	valueType: "STR","NUM", "BOOL", "ARR", "OBJ", "BUFF"
*/

exports.addProductProperty = function(req, res, next){
	Product.findOne( {_creator:req.params.DEVID, _id:req.params.PRODID},
		function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		var temp = req.body.name.replace(/\s/g,'');
		var name = temp.toLowerCase();
		for(var i = 0; i < prod.properties.length; i++){
			if(prod.properties[i].name == name ){
				var error = new Error("property name "+name+"already exists");
				res.send(error);
				throw error;		
			}
		}
		var prop = {
			name:name, 
			access: {state:req.body.access.state}, 
			control: {state:req.body.control.state}, 
			valueType: req.body.valueType,
			description: req.body.description,
			min: req.body.min,
			max: req.body.max
		};
		
		if(req.body.access.hasOwnProperty('func')){
			prop.access.func = req.body.access.func;
		};

		if(req.body.control.hasOwnProperty('func')){
			prop.control.func = req.body.control.func;
		};

		prod.checkPropertyExists(prop.name, function(err1){
			if(err1){
				res.send(err1);
				throw err1;
			}
			prod.properties.push(prop);
			prod.save(function(err){
    			if(err){
					res.send(err);
					throw err;
				}
				res.send("Add Property success: "+prop.name+"@"+prod._name);
				next();
			});
		});
	});
}

// method to remove property of a product
/*
	param: DEVID, PRODID
	body:
	{
		name: String
	}
*/
exports.deleteProductProperty = function(req, res, next){
	Product.findOne( {_creator:req.params.DEVID, _id:req.params.PRODID},
	function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(prod.properties.length > 0){
			for(var i=0; i<prod.properties.length; i++){
				if(prod.properties[i].name.toLowerCase()===req.body.name.toLowerCase()){
					var doc = prod.properties.id(prod.properties[i]._id).remove();
					prod.save(function(err){
    					if(err){
							res.send(err);
							throw err;
						}
					});
					res.send("Delete Property success: "+req.body.name.toLowerCase()+"@"+prod._name);
					next();
				}
			}
			var new_err1 = new Error("Property: "+ req.body.name.toLowerCase()+" is not found");
			res.send(new_err1);
			throw new_err1;
		}else{
			var new_err2 = new Error("No property defined: "+prod._name);
			res.send(new_err2);
			throw new_err2;
		}
	});
	next();
}

// function discover thing(s)
// return array of {id: String, name: String}
exports.discoverThings = function(req, res, next){
	Product.findOne( {_id:req.params.PRODID},
	function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(!prod){ 
			var error = new Error("Product not found");
			res.send(error);
			throw error;
		}
		prod.discoverThing(req.body.token,function(err, data){
			if(err){
				res.send(err);
				throw err;		
			}
			res.send(data);
			next();
		});
	});
	next();
}

exports.validateTokenExt = function(req, res, next){
	Product.findOne( {_id:req.params.PRODID},
	function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		if(!prod){ 
			var error = new Error("Product not found");
			res.send(error);
			throw error;
		}
		if(prod.token_auth){
			prod.token_auth(req.body.token, function(err){
				if(err){
					res.send(err);
					throw err;
				}
				res.send("Token valid");
			});
		}else{
			res.send(new Error("invalid method"));
			throw (new Error("invalid method"));
		}
	});
	next();
}
