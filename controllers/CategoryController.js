/*
* class CategoryController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Category = mongoose.model("../models/Category");
var 
var ObjectId = mongoose.Types.ObjectId;

// method to create/register new category
/*
	param: no
	body:
	{
		name: String,
		image: String URI
	}
*/
exports.registerCategory = function(req,res,next){
	var new_category = new Category({
		_name: req.body.name
	});
	
	if(typeof req.params.image === "undefined"){
		new_category.image = "SET DEFAULT IMAGE URI"
	}else new_category.image = req.body.image;

	new_category.save(function(err){
		if (err){err
			res.send(err);
			throw err;
		}
		res.send("New category added: "+ new_category._name);
	});
	next();
}

// method to get all category
/*
	param: no
	body: no
*/
exports.getAllCategory = function(req, res, next){
	Category.find({}, function(err, cats){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(cats);
	});
	next();
}

// method to edit a category
/*
	param: no
	body:
	{
		prevName: String,
		curName: String
	}
*/
exports.editCategory = function(req, res, next){
	Category.findOneAndUpdate({_name: req.body.prevName}, {_name: req.body.curName},
		function(err, cat) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Update success Category:"+cat._name+"@id:"+cat._id);
	});
	next();	
}

// method to delete a category
/*
	param: no
	body:
	{
		name: String
	}
*/
exports.deleteCategory = function(req, res, next){
	Category.findOneAndRemove({_name: req.body.name},
		function(err, cat) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Delete success Category:"+cat._name+"@id:"+cat._id);
	});
	next();	
}

// method to get all products by a category
/*
	param: no
	body:
	{
		name: String
	}
*/
exports.getAllProductByCategory = function(req, res, next){
	Category.findOne({_name: req.body.name}, function(err, cat){
		if(err){
			res.send(err);
			throw err;
		}
		Product.find({category: cat._id}, function(err, prods){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(prods);
		});
	});
	next();
}

// method to get all things by a category
/*
	param: no
	body:
	{
		name: String
	}
*/
exports.getAllThingByCategory = function(req, res, next){
	Category.findOne({_name: req.body.name}, function(err, cat){
		if(err){
			res.send(err);
			throw err;
		}
		Thing.find({category: cat._name}, function(err, things){
			if(err){
				res.send(err);
				throw err;
			}
			res.send(things);
		});
	});
	next();
}