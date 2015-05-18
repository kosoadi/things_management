var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propSchema = new Schema({
	name: {type: String, required: true, unique: true}, 
	access: {type: Boolean, required: true}, 
	control: {type: Boolean, required: true}, 
	valueType: {type: String, required: true}, //"STR","NUM", "BOOL", "ARR", "OBJ", "BUFF", "DATE"
	description: {type: String, required: true},
	min: {type: Schema.Types.Mixed, required: true},
	max: {type: Schema.Types.Mixed, required: true}
});

var productSchema = new Schema({
	_creator: {type: Schema.Types.ObjectId, ref:'Developer'},
	_name: {type: String,required: true, unique: true},
	category: {type: Schema.Types.ObjectId, ref:'Category'},
	properties: [propSchema], 
	token: String,
	image: String,
	date_created: Date,
	date_updated: Date
});

productSchema.methods.checkPropertyExists = function(propName, cb){
	for(var i=0; i<this.properties.length; i++){
		if(this.properties[i].name === propName){
			return cb(new Error("Property: "+propName+" already existed"));
		}
	}
	cb();
};

propSchema.pre('save', function(next){
	var arr_type = ["STR","INT","DBL", "BOOL", "ARR", "OBJ", "BUFF","DATE"];
	if(arr_type.indexOf(this.valueType) === -1){
		return next(new Error("invalid valueType"));
	}
	next();
});

productSchema.pre('save', function(next){
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
