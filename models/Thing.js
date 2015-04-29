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
	_owner: {type: Schema.Types.ObjectId, ref:'User'},
	_product: {type: Schema.Types.ObjectId, ref:'Product'},
	name: {type: String, required: true},
	type: String,
	category: String,
	location: String,
	endpoint: String,
	token: String,
	date_created: Date,
	date_updated: Date,
	properties: [{type: Schema.Types.ObjectId, ref: 'Property'}]
});

// 	category: {type: Schema.Types.category, ref:'Product'},

/*
thingSchema.plugin(autoIncrement.plugin,{
	model: 'Thing',
	field: 'thingid'
});
*/
thingSchema.index({_owner: 1, _id: 1}, {unique: true});

thingSchema.method.validateTypeCategory = function (productId){
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
	//thingScheme.validateTypeCategory(this._product);
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Thing = mongoose.model('Thing', thingSchema);

module.exports = Thing;