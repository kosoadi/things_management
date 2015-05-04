var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propertySchema = new Schema({
	_thingid: {type: Schema.Types.ObjectId, ref:'Thing'},
	_name: {type: String, required: true}, // No space allowed
	access: Boolean,
	control: Boolean,
	valueType: String, // STR | INT | DBL | BOOL | ARR | OBJ
	description: String,
	min: String,
	max: String,
	date_created: Date,
	date_updated: Date
});

propertySchema.index({_thingid: 1, _name: 1}, {unique: true});

propertySchema.pre('save', function(next){
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Property = mongoose.model('Property', propertySchema);

module.exports = Property;