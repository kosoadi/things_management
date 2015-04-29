/*
* class ProductController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Product = mongoose.model("../models/Product");
var Category = mongoose.model("../models/Category");
var ObjectId = mongoose.Types.ObjectId;

// method to create/register developer
exports.registerProduct = function(req,res,next){
	var new_product = new Product({
		_creator: req.params.DEVID,
		_name: req.body.name,		
		token: req.body.token,
		new_product.category: req.body.category 
	});
	
	if(!req.body.hasOwnProperty('image')){
		new_developer.image = "SET DEFAULT IMAGE URI";
	} else new_developer.image = req.body.image;

	// TO DO validate token
	/*********************/

    new_product.save(function(err){
    	if(err){
			res.send(err);
			throw err;
		}
    	Developer.findOne({_id: new_product._creator}, function(err, dev){
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

exports.getProduct = function(req, res, next){
	Product.find({_creator: req.params.DEVID}, function(err, prods){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(prods);
	});
	next();	
}

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