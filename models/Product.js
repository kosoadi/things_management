var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
	_creator: {type: Schema.Types.ObjectId, ref:'Developer'},
	_name: {type: String, index: true, required: true, unique: true},
	category: {type: Schema.Types.ObjectId, ref:'Category'},
	properties: [Object], //Array of JSON Objects containing properties definition
	token: String,
	image: String,
	date_created: Date,
	date_updated: Date
});

productSchema.methods.checkPropertyValidity = function(prop, cb){
	for(var p in prop){
		var valType = prop[p].hasOwnProperty('valueType');
		
		if(arr_type.indexOf(valType) < -1){
			return cb(false);
		} 
		if(prop[p].hasOwnProperty('name') && prop[p].hasOwnProperty('access') 
			&& prop[p].hasOwnProperty('control') && prop[p].hasOwnProperty('description')){		
			return cb(true);
		}
	}
	return cb(false);
};

productSchema.methods.addProperty = function(prop, cb){
	var arr_type = ["STR","NUM", "BOOL", "ARR", "OBJ", "BUFF"]
	var valType = prop.hasOwnProperty('valueType');
	if(arr_type.indexOf(valType) < -1){
		return cb(false);
	}
	if((typeof prop.name==="string") && (typeof prop.access==="boolean") 
		&& (typeof prop.control==="boolean") && (typeof prop.description==="string")){		
		
		if(this.properties.length > 0){
			for(var i in this.properties){
				if(this.properties[i].name.toUppperCase() === prop.name.toUppperCase()){
					return cb(false);
				}
			}
		}
		this.properties.push(prop);
		return cb(true);
	}
	return cb(false);
};

productSchema.methods.checkPropertyExist = function(propName, cb){
	if(this.properties.length == 0){
		return cb(false);
	}
	for(var p in this.properties){
		if(this.properties[p].name.toUppperCase() === propName.toUppperCase()){
			return cb(true);
		}
	}
	return cb(false);
};

productSchema.methods.removeProperty = function(propName, cb){
	if(this.properties.length == 0){
		return cb(false);
	}
	for(var i = 0; i<this.properties.length; i++){
		if(properties[i].name.toUppperCase() === propName.toUppperCase()){
			this.properties.splice(i, 1); // remove 1 item from properties
			return cb(false);
		}
	}
	return cb(false);
};

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