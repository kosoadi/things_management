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

server.post('/sot/category/register', controllers.CategoryController.registerController);
server.get('/sot/category', controllers.CategoryController.getAllCategory);
server.put('/sot/category', controllers.CategoryController.editCategory);
server.del('/sot/category', controllers.CategoryController.deleteCategory);
server.get('/sot/category/product', controllers.CategoryController.getAllProductByCategory);
server.get('/sot/category/thing', controllers.CategoryController.getAllThingByCategory);

server.post('/sot/user/register', controllers.UserController.registerUser);
server.get('/sot/user', controllers.UserController.getAllUser);
server.get('/sot/user/:USERID', controllers.UserController.getUser);
server.put('/sot/user/:USERID', controllers.UserController.editUser);
server.del('/sot/user/:USERID', controllers.UserController.deleteUser);
 
server.post('/sot/developer/register', controllers.DeveloperController.registerDeveloper);
server.get('/sot/developer', controllers.DeveloperController.getAllDeveloper);
server.get('/sot/developer/:DEVID', controllers.DeveloperController.getDeveloper);
server.put('/sot/developer/:DEVID', controllers.DeveloperController.editDeveloper);
server.del('/sot/developer/:DEVID', controllers.DeveloperController.deleteDeveloper);



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
