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

var uuid = require('node-uuid');

var crypto = require('crypto');
var algorithm = 'aes-256-gcm';
var password = 'thisispassword';

// method to create/register developer
/*
	param: DEVID
	body:
	{
		name: String,
		token: String,
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
		var new_product = new Product({
			_creator: dev._id,
			_name: req.body.name,		
			token: req.body.token,
			category: req.body.categoryid, 
			properties:[]
		});
	
		if(!req.body.hasOwnProperty('image')){
			new_product.image = "SET DEFAULT IMAGE URI";
		} else new_product.image = req.body.image;

		// TO DO validate token
		/*********************/

    	new_product.save(function(err){
    		if(err){
				res.send(err);
				throw err;
			}
			dev.products.push(new_product);	
    		dev.save(function(err){
    			if(err){
					res.send(err);
					throw err;
				}
				res.send("New product created: "+new_product._name+" by "+dev.name);		
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
// http://lollyrock.com/articles/nodejs-encryption/
exports.getGeneratedTokens = function(req, res, next){
	Product.findOne({_creator: req.params.DEVID, _id:req.params.PRODID}, function(err, prod) {
		if (err){ 
			res.send(err);
			throw err;
		}
		var text = prod._id;
		var tokens = [];
		var size = req.params.SIZE;		
		// initialization vector
		var init_vector = "";
		var cipher = null;
		var temp = "";
		for(int i = 0; i<size; i++){
			init_vector = uuid.v4();
			cipher = crypto.createCipheriv(algorithm, password, init_vector);
			var encrypted = cipher.update(text, 'utf8', 'hex');
			encrypted += cipher.final('hex');
  			var tag = cipher.getAuthTag();
			tokens.push({tag: tag, content: encrypted});
		}
		if(size===1){
			res.send(tokens[0]);
			next();
		}
		res.send(tokens);
		next();
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
		var prop = {
			name:name, 
			access: req.body.access, 
			control: req.body.control, 
			valueType: req.body.valueType,
			description: req.body.description,
			min: req.body.min,
			max: req.body.max
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
