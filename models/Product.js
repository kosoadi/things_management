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

productSchema.method.checkPropertyValidity = function(prop){
	for(var p in prop){
		var valType = prop[p].hasOwnProperty('valueType');
		
		if(arr_type.indexOf(valType) < -1){
			return false;
		} 
		if(prop[p].hasOwnProperty('name') && prop[p].hasOwnProperty('access') 
			&& prop[p].hasOwnProperty('control') && prop[p].hasOwnProperty('description')){		
			return true;
		}
	}
	return false;
};

productSchema.method.addProperty = function(prop){
	var arr_type = ["STR","NUM", "BOOL", "ARR", "OBJ", "BUFF"]
	var valType = prop.hasOwnProperty('valueType');
	if(arr_type.indexOf(valType) < -1){
		return false;
	} 
	if((typeof prop.name==="string") && (typeof prop.access==="boolean") 
		&& (typeof prop.control==="boolean") && (typeof prop.description==="string")){		
		for(var i in this.properties){
			if(this.properties[i].name.toUppperCase() === prop.name.toUppperCase()){
				return false;
			}
		}
		this.properties.push(prop);
		return true;
	}
	return false;
};

productSchema.method.checkPropertyExist = function(propName){
	for(var p in this.properties){
		if(properties[p].name.toUppperCase() === propName.toUppperCase()){
			return true;
		}
	}
	return false;
};

productSchema.method.removeProperty = function(propName){
	for(var i = 0; i<this.properties.length; i++){
		if(properties[i].name.toUppperCase() === propName.toUppperCase()){
			this.properties.splice(i, 1); // remove 1 item from properties
			return true;
		}
	}
	return false;
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