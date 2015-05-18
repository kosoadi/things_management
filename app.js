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

/*
var User = require('./models/User');
var Developer = require('./models/Developer');
var Product = require('./models/Product');
var Thing = require('./models/Thing');
var Property = require('./models/Property');
var Category = require('./models/Category');
*/

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

server.post('/sot/category/register', controllers.CategoryController.registerCategory);
server.get('/sot/category', controllers.CategoryController.getAllCategory);
server.put('/sot/category', controllers.CategoryController.editCategory);
server.del('/sot/category', controllers.CategoryController.deleteCategory);
server.get('/sot/category/:CATID/product', controllers.CategoryController.getAllProductByCategory);
server.get('/sot/category/:CATID/thing', controllers.CategoryController.getAllThingByCategory);

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

server.post('/sot/developer/:DEVID/product/register', controllers.ProductController.registerProduct);
server.get('/sot/product', controllers.ProductController.getAllProduct);
server.get('/sot/developer/:DEVID/product', controllers.ProductController.getAllDeveloperProduct);
server.get('/sot/developer/:DEVID/product/:PRODID', controllers.ProductController.getDeveloperProduct);
server.get('/sot/developer/:DEVID/product/:PRODID/gentoken/:SIZE', controllers.ProductController.getGeneratedTokens);
server.put('/sot/developer/:DEVID/product/:PRODID', controllers.ProductController.editProduct);
server.del('/sot/developer/:DEVID/product/:PRODID', controllers.ProductController.deleteProduct);
server.put('/sot/developer/:DEVID/product/:PRODID/property', controllers.ProductController.addProductProperty);
server.del('/sot/developer/:DEVID/product/:PRODID/property', controllers.ProductController.deleteProductProperty);

server.post('/sot/user/:USERID/thing/register', controllers.ThingController.registerThing);
server.get('/sot/thing', controllers.ThingController.getAllThing);
server.get('/sot/user/:USERID/thing', controllers.ThingController.getAllUserThing);
server.get('/sot/user/:USERID/thing/:THINGID', controllers.ThingController.getUserThing);
server.put('/sot/user/:USERID/thing/:THINGID', controllers.ThingController.editThing);
server.del('/sot/user/:USERID/thing/:THINGID', controllers.ThingController.deleteThing);

server.post('/sot/user/:USERID/thing/:THINGID/property/register', controllers.PropertyController.registerProperty);
server.get('/sot/property', controllers.PropertyController.getAllProperty);
server.get('/sot/user/:USERID/thing/:THINGID/property', controllers.PropertyController.getAllUserProperty);
server.get('/sot/user/:USERID/thing/:THINGID/property/:PROPNAME', controllers.PropertyController.getUserProperty);
server.put('/sot/user/:USERID/thing/:THINGID/property/:PROPNAME', controllers.PropertyController.editProperty);
server.del('/sot/user/:USERID/thing/:THINGID/property/:PROPNAME', controllers.PropertyController.deleteProperty);

server.get('/sot/user/:USERID/thing/:THINGID/property/:PROPNAME/acc', controllers.PropertyController.getPropertyValue);
server.put('/sot/user/:USERID/thing/:THINGID/property/:PROPNAME/ctl', controllers.PropertyController.getPropertyValue);

server.listen(4242, function () {
  console.log('%s listening at %s', server.name, server.url);
});
