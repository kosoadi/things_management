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
		var prop = {
			name:req.body.name.toLowerCase(), 
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
