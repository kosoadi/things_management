var mongoose = require('mongoose')
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;


var propertySchema = new Schema({
	_thingid: {type: Schema.Types.ObjectId, ref:'Thing'},
	_name: {type: String, required: true}, // No space allowed
	access: {state:{type: Boolean, required: true}, func: Function}, 
	control: {state:{type: Boolean, required: true}, func: Function},
	valueType: String, // STR | INT | DBL | BOOL | ARR | OBJ
	description: String,
	min: Schema.Types.Mixed,
	max: Schema.Types.Mixed,
	date_created: Date,
	date_updated: Date,
	shares: [{
		postid: String,
		level: Number, // 0:share info; 1:share access; 2:share control; 3:access&control 
	}]
});

/*
prod.properties[i].access.func = function(next){
	var result = "getSOMETHING";
	return next(err, result);
}
prod.properties[i].control.func = function(data, next){
	// DO something with data
	var result = "getResultStatus";
	return next(err, result);
}
prop.access.func = prod.properties[i].access.func;
prop.access.func(data, function(result, err){
});
*/
propertySchema.index({_thingid: 1, _name: 1}, {unique: true});

propertySchema.methods.runAccess = function (next){
	if(this.access.state == false){
		return next(new Error("access forbidden"));
	}
	if(typeof this.access.func == 'undefined'){
		return next(new Error("function undefined"));
	}
	this.access.func(function(err, data){
		if(err){
			return next(err, {});
		}
		return (false, data);
	});
};

propertySchema.methods.runControl = function (data, next){
	if(this.control.state == false){
		return next(new Error("control forbidden"));
	}
	if(typeof this.control.func == 'undefined'){
		return next(new Error("function undefined"));
	}
	this.control.func(function(err, result){
		if(err){
			return next(err, {});
		}
		return (false, result);
	});
};

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