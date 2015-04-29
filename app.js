//http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
//http://www.slideshare.net/spf13/hybrid-mongodb-and-rdbms-applications
//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//http://phaninder.com/posts/mongodbmongoose-connect-best-practices
//http://theholmesoffice.com/mongoose-connection-best-practice/
//http://code.tutsplus.com/tutorials/restful-api-design-with-nodejs-restify--cms-22637
var restify = require('restify');
var mongoose = require('mongoose');
var fs = require('fs');
require('./db');
///*
var User = require('./models/User');
var Developer = require('./models/Developer');
var Product = require('./models/Product');
var Thing = require('./models/Thing');
var Property = require('./models/Property');
var Category = require('./models/Category');
var Token = require('./models/Token');
//*/

var controllers = {}
	, controllers_path = process.cwd() + '/controllers' 
	fs.readdirSync(controllers_path).forEach(function (file) {
    	if (file.indexOf('.js') != -1) {
        	controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    	}
});

var server = restify.createServer({
  name: 'things_management',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

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

function getPropertyValue(req, res, next){
	var userid = req.params.USERID;
	var thingid = req.params.THINGID;
	var name = req.params.PROPNAME;

	Property.findOne({_thingid:thingid, _name:name}, function(err, prop){
		if(err){
			res.send("Property not found");
			throw err;
		}
		Thing.findOne({_id: prop._thingid}, function(err, thing){
			if(err){
				res.send(err);
				throw err;
			}
			if(thing.type == "lifx" && thing.category == "light"){
				
			}		
		});
	});
}

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
 
server.post('/sot/thing/register/:USERID', registerThing); // register User-owned thing
server.post('/sot/user/register', registerUser); // register user
server.post('/sot/developer/register', registerDeveloper); // register developer
server.post('/sot/product/register/:DEVID', registerProduct); // register developer product
server.post('/sot/user/:USERID/thing/:THINGID/register', registerThingProperty); // register a property
server.post('/sot/category/register', registerCategory); // register a category

server.get('/sot/thing/all', getAllThing);
server.get('/sot/user/all', getAllUser);
server.get('/sot/developer/all', getAllDeveloper);
server.get('/sot/product/all', getAllProduct);
server.get('/sot/product/:PRODUCTID/property', getProductProperty); // get product's properties
server.get('/sot/user/:USERID/thing', getUserThing); // get all things of a user
server.get('/sot/user/:USERID/thing/:THINGID', getThingProperty); // get all properties of a thing
server.get('/sot/developer/:DEVID/product', getDeveloperProduct); // get all products of a developer
server.get('/sot/property/all', getAllProperty); // get all shared properties
server.get('/sot/category/all', getAllCategory); // get all category
// server.get('/sot/token/all'); // get all things' tokens
// server.get('/sot/token/:THINGID'); // get thing's token

// server.get('/5ba6207/user/:USERID/thing/:THINGID/:PROPNAME', getPropertyValue);
// server.put('/5ba6207/user/:USERID/thing/:THINGID/:PROPNAME', setPropertyValue);
server.put('/sot/product/:PRODUCTID/property', addProductProperty); // get product's properties

server.listen(4242, function () {
  console.log('%s listening at %s', server.name, server.url);
});
