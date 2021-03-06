//http://mongoosejs.com/docs/populate.html
//http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var developerSchema = new Schema({
	_username: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	password: String,
	email: {type: String, required:true},
	description: String,
	website: String,
	date_created: Date,
	date_updated: Date,
	image: String,
	status: Boolean,
	max_product: Number,
	products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

developerSchema.pre('save', function(next){
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Developer = mongoose.model('Developer', developerSchema);

module.exports = Developer;
