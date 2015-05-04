/*
* class ProductController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Product = require("../models/Product");
var Developer = require("../models/Developer");
var Category = require("../models/Category");
var ObjectId = mongoose.Types.ObjectId;

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
		res.send("Delete success Product:"+prod._name+"@id:"+prod._id);
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
		prod.checkPropertyExist(req.body.name, function(exists){
			if(!exists){
				prod.addProperty(req.body, function(result){
					res.send(result?"y":"n");next();
					if(!result){
						res.send("Invalid properties definition");
						next();
					}
					prod.save(function(err){
    					if(err){
							res.send(err);
							throw err;
					}
					res.send("Add Property success Product:"+prod._name);
					next();
    				});
				});
			}
			res.writeHead(500);
			res.send("Product property already exists:"+req.body.name);
			next();
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
		if(!prod.removeProperty(req.body.name)){
			res.send("Property not found");
			next();			
		}
		prod.save(function(err){
    		if(err){
				res.send(err);
				throw err;
			}
			res.send("Remove Property success Product:"+prod._name);
    	});
	});
	next();
}
