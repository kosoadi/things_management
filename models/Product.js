var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = '12345678901234567890123456789012';

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
	description: String,
	image: String,
	token: {type:String, default:function genUUID(){uuid.v4()}},
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

productSchema.methods.validateToken = function (token, next){
	var decipher = crypto.createDecipher(algorithm,password)
  	var dec = decipher.update(token,'hex','utf8')
  	dec += decipher.final('utf8');
  	
  	var first = dec.substring(8, 16);
	var mid1 = dec.substring(20, 24);
	var mid2 = dec.substring(28, 32);
	var mid3 = dec.substring(36, 40);
	var end = dec.substring(52, 64);

	var text = first+"-"+mid1+"-"+mid2+"-"+mid3+"-"+end;

	if(this.token == text){
		return next();
	} else{
		var err = new Error("Invalid token");
		throw err;
	} 
};

productSchema.methods.generateToken = function (size, next){
		if(size<1){
		var err = new Error("Invalid size");
			return next(err, {});
		}
		var text = this.token.split("-");
		var tokens = [];		
		var toEnc = "";
		// initialization vector
		var init_vector = [];
		var cipher = crypto.createCipher(algorithm, password);
		for( i = 0; i<size; i++){
			init_vector = uuid.v4().split("-"); // size:5 // e.g. 110ec58a-a0f2-4ac4-8393-c866d813b8d1
			toEnc = ""+init_vector[0]+text[0]+init_vector[1]+text[1]+init_vector[2]+text[2]+init_vector[3]+text[3]+init_vector[4]+text[4];
			var encrypted = cipher.update(toEnc, 'utf8', 'hex');
			encrypted += cipher.final('hex');
			tokens.push(encrypted); // 56 characters 
		}
		if(tokens.length==1){
			return next(false, tokens[0]);
		} else return next(false, tokens);
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
