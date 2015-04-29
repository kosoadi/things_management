
// get a product's properties
// if exist, do update
// input: JSON (name, access, control, valueType, description)
function addProductProperty(req, res, next){
	var prodid = req.params.PRODUCTID;
	Product.findOne({_id: prodid}, function(err, prod){
		if (err){ 
			res.send(err);
			throw err;
		}
		prod.removeProperty(req.body.name);
		// TO DO
	});
	next();
}

// register a category
function registerCategory(req,res,next){
	
	var new_category = new Category({
		_name: req.body.category
	});
	console.info(new_category);
	new_category.save(function(err){
		if (err){err
			console.error(err);
			res.send(err);
			throw err;
		}
		res.send("New category added: "+ new_category._name);
	});
	next();
}

// register user
function registerUser(req,res,next){
	var new_user = new User({
		_username: req.body.username,
		name: req.body.name,
		password: req.body.password,
	});
	new_user.save(function(err){
		if (err){err
			console.error(err);
			res.send(err);
			throw err;
		}
		res.send("New user registered: "+ new_user._username + " @ "+ new_user.name);
	});
	next();
}

// register developer
function registerDeveloper(req,res,next){
	var new_developer = new Developer({
		_username: req.body.username,
		name: req.body.name,
		password: req.body.password,
		description: req.body.description,
		website: req.body.website
	});
	new_developer.save(function(err){
		if (err){err
			console.error(err);
			res.send(err);
			throw err;
		}
		res.send("New developer registered: "+ new_developer._username + "@"+ new_developer.name);
	});
	next();
}

// get all users
function getAllUser(req, res, next){
	User.find({}, function(err, users) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(users);
	});
	next();	
}

// get all developers
function getAllDeveloper(req, res, next){
	Developer.find({}, function(err, devs) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(devs);
	});
	next();	
}

// get all things
function getAllThing(req, res, next){
	Thing.find({}, function(err, things) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(things);
	});
	next();	
}

// register a product
function registerProduct(req, res, next){
	var new_product = new Product({
		_creator: req.params.DEVID,
		_name: req.body.name		
	});
	
	Category.findOne({_name: req.body.category}, function(err, category){
		if(err){
			res.send("Category does not exist");
			throw err;
		}
		new_product.category = category._id;
	});
	/*
	try {
        JSON.parse(req.body.property);
    } catch (e) {
        res.send("Property(s) must be in JSON format");
        next();
    }

    if(Object.keys(req.body.property).length == 0){
    	res.send("Properties have to be defined");
        next();
    }else{
    	// TO BE Implemented to validate properties definition
    }
	*/
    new_product.token = "12345678"; // tokenization TO BE Implemented

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
				res.send("New product created: "+new_product._name+" by "+dev._name);		
    		});
    	});
    });
    next();
}

// register a thing
function registerThing(req, res, next){
	var new_thing = new Thing({
		_owner: req.params.USERID,
		name: req.body.name,
		location: req.body.location,
		endpoint: req.body.endpoint
	});

	//new_thing.validateTypeCategory(new_thing._product);
	
	Product
	.findOne({ _name: req.body.type})
	.populate('_creator')
	.populate('category')
	.exec(function(err, prod){
		if(err){
			res.send("Product/Type does not exist");
			throw err;
		}
		new_thing.category = category._name;
		new_thing._product = _creator._id;
		new_thing.type = req.body.type;
	});
		
    new_thing.save(function(err){
    	if(err){
			res.send(err);
			throw err;
		}
    	User.findOne({_id: new_thing._owner}, function(err, user){
    		if(err){
				res.send(err);
				throw err;
			}
			user.things.push(new_thing);	
    		user.save(function(err){
    			if(err){
					res.send(err);
					throw err;
				}
				res.send("New thing created: "+new_thing._name+" by "+user._username);		
    		});
    	});
    });
    next();
}

// get all products
function getAllProduct(req, res, next){
	Product.find({}, function(err, products) {
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(products);
	});
	next();	
}

// get a product's properties
function getProductProperty(req, res, next){
	var prodid = req.params.PRODUCTID;
	Product.findOne({_id: prodid}, function(err, prod){
		if (err){ 
			res.send(err);
			throw err;
		}
		res.send(prod.property);
	});
	next();
}

// register thing property
function registerThingProperty(req, res, next){
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;
	var properties = JSON.parse(req.body);

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
				Property.find({_thingid: thing._thingid}).remove().exec();
				res.send(err);
				throw err;
			}
			res.send("Properties added");
		});		
	});
	next();
}

// get all things of a user
function getUserThing(req, res, next){
	var userid = req.params.USERID;

	Thing.find({_owner: userid}, function(err, things){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(things);
	});
	next();
}

// get all properties of a thing
function getThingProperty(req, res, next){
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;

	Property.find({_thingid: thingid}, function(err, props){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(props);
	});
	next();
}

// get all products of a developer
function getDeveloperProduct(req, res, next){
	var devid = req.params.DEVID;
	Product.find({_creator: devid}, function(err, prods){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(prods);
	});
	next();
}

function getAllProperty(req, res, next){
	Property.find({}, function(err, props){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(props);
	});
	next();	
}

function getAllCategory(req, res, next){
	Category.find({}, function(err, cats){
		if(err){
			res.send(err);
			throw err;
		}
		res.send(cats);
	});
	next();
}