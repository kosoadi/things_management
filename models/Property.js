var mongoose = require('mongoose')
require('mongoose-function')(mongoose);
var Schema = mongoose.Schema;
var mqtt = require('mqtt');

var propertySchema = new Schema({
	_thingid: {type: Schema.Types.ObjectId, ref:'Thing'},
	_name: {type: String, required: true}, // No space allowed
	access: {state:{type: Boolean, required: true}, func: Function}, 
	control: {state:{type: Boolean, required: true}, func: Function},
	valueType: String, // STR | INT | DBL | BOOL | ARR 
	description: String,
	min: Schema.Types.Mixed,
	max: Schema.Types.Mixed,
	date_created: Date,
	date_updated: Date,
	topic: {setter:String, getter:String},
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
	if(this.access.state == true){
		if(typeof this.access.func != 'undefined'){
			this.access.func(function(err, data){
				return next(err, data);
			});
		}
		var client = mqtt.connect("LINK uri mosquitto");
		client.on('connect', function () {
  			client.subscribe(this.topic.getter);
		});
		client.on('message', function (topic, message) {
  			client.end();
			return next(null, message.toString());
		});
	}else{
		var error = new Error("Invalid command");
		return next(error, null);
		throw error;
	}
};

propertySchema.methods.runControl = function (input, next){
	if(this.control.state == true){
		if(this.valueType == "INT"){
			input = parseInt(input);
			if(this.min>input || input>this.max){
				var error = new Error("Invalid input");
				return next(error, null);
				throw error; 			
			}
		}else if(this.valueType == "DBL"){
			if(this.min>input || input>this.max){
				var error = new Error("Invalid input");
				return next(error, null);
				throw error; 			
			}
		}
		if(typeof this.control.func != 'undefined'){
			this.control.func(input, function(err, data){
				return next(err, data);
			});
		}
		var client = mqtt.connect("LINK uri mosquitto");
		client.on('connect', function () {
  			client.publish(this.topic.setter, input+"");
  			client.end();
  			return next(null, "Published topic:"+ this.topic.setter+":"+input);
		});
	}else{
		var error = new Error("Invalid command");
		return next(error, null);
		throw error;
	}
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