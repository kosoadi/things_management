//http://mongoosejs.com/docs/populate.html
//https://www.npmjs.com/package/mongoose-auto-increment
//http://stackoverflow.com/questions/14454271/auto-increment-document-number-in-mongo-mongoose
// http://jaketrent.com/post/mongoose-population/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./Product');
//var autoIncrement = require('mongoose-auto-increment');
//var connection = mongoose.createConnection('mongodb://localhost/mydb');
//autoIncrement.initialize(connection);

var thingSchema = new Schema({
	_id: {type:String, default:mongoose.Types.ObjectId().toString(), unique:true},
	_owner: {type: Schema.Types.ObjectId, ref:'User', required: true},
	_product: {type: Schema.Types.ObjectId, ref:'Product', required: true},
	name: {type: String, required: true},
	type: String,
	category: String,
	location: String,
	token: {type: String, required: true},
	date_created: Date,
	date_updated: Date,
	properties: [{type: Schema.Types.ObjectId, ref: 'Property'}]
});

thingSchema.index({_owner: 1, token:1, name:1}, {unique: true});

thingSchema.methods.validateTypeCategory = function (productId, next){
	Thing
		.findOne({ _product: productId})
		.populate('_product')
		.exec(function (err, thing) {
			if (err) throw err;
			this.type = thing._product._name;
			this.category = thing._product.category._name;
		});
	return next();
};

thingSchema.pre('save', function(next){
	
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Thing = mongoose.model('Thing', thingSchema);

module.exports = Thing;