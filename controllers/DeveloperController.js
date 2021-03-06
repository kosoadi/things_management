// http://code.tutsplus.com/tutorials/restful-api-design-with-nodejs-restify--cms-22637
/*
* class DeveloperController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Developer = require("../models/Developer");
var Product = require("../models/Product");
var ObjectId = mongoose.Types.ObjectId;

// method to create/register developer
/*
	param: no
	body:
	{
		username: String,
		name: String,
		password: String,
		description: String
	}
*/
exports.registerDeveloper = function(req,res,next){
	var new_developer = new Developer({
		_username: req.body.username,
		name: req.body.name,
		password: req.body.password,
		description: req.body.description,
		email: req.body.email,
		status: true,
		products: []
	});
	
	if(!req.body.hasOwnProperty('image')){
		new_developer.image = "SET DEFAULT IMAGE URI";
	}else new_developer.image = req.body.image;

	if(!req.body.hasOwnProperty('website')){
		new_developer.website = "No Website";
	}else new_developer.website= req.body.website;
	new_developer.save(function(err){
		if (err){
			res.send(err);
			throw err;
		}
		res.send("New developer registered: "+ req.body.username + "@"+req.body.name); next();
	});
	next();
}

// method to get a developer
/*
	param: DEVID
	body: no
*/
exports.getDeveloper = function(req, res, next){
	Developer.findById(req.params.DEVID, function(err, dev) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(dev);
	});
	next();	
}

// method to get all developers
/*
	param: no
	body: no
*/
exports.getAllDeveloper = function(req, res, next){
	Developer.find({}, function(err, devs) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(devs);
	});
	next();	
}

exports.removeDeveloper = function(req, res, next){
	Developer.findOneAndUpdate( {_id:req.params.DEVID}, {status:false},
		function(err, dev) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Successfully changed status to INACTIVE Developer:"+dev._username+"@id:"+dev._id);
	});
	next();	
}

// method to edit a developer
/*
	param: DEVID
	body:
	{
		_username: String,
		name: String,
		password: String,
		description: String,
		website: String,
		image: String,
		status: Boolean,
		max_product: Number (Integer)
	}
*/
exports.editDeveloper = function(req, res, next){
	Developer.findOneAndUpdate( {_id:req.params.DEVID}, req.body,
		function(err, dev) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send("Update success Developer:"+dev._username+"@id:"+dev._id);
	});
	next();	
}

// method to delete a developer
/*
	param: DEVID
	body: no
*/
exports.deleteDeveloper = function(req, res, next){
	Developer.findOneAndRemove( {_id:req.params.DEVID},
		function(err, dev) {
		if (err){ 
			res.send(err);
			throw err;
		}
		Product.find({_creator: dev._id}, function(err, products){
			if (err){ 
				res.send(err);
				throw err;
			}
			for(var i=0; i<products.length; i++){
				products[i].remove(function(err){
					if (err){ 
						res.send(err);
						throw err;
					}
					Thing.find({_product: products[i]._id}, function(err, things){
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
					});
				});
			}
			res.send("Delete success Developer:"+dev._username+"@id:"+dev._id);	
		});
	});
	next();	
}
