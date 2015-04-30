//https://github.com/simonholmes/mongoose-default-connection/blob/master/model/db.js
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
//require('./models/models.js').initialize();

// Build the connection string
var dbURI = 'mongodb://localhost/mydb';

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// Create the database connection
mongoose.connect(dbURI);

// BRING IN YOUR SCHEMAS & MODELS
// For example
/*
require('./models/User');
require('./models/Developer');
require('./models/Product');
require('./models/Thing');
require('./models/Property');
require('./models/Category');
//require('./models/Token');
*/
