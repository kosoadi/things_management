var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	_name: {type: String, unique: true, required: true},
	date_created: Date,
	date_updated: Date,
	image: String
}); // _creator: {type: Schema.Types.ObjectId, ref:'Developer'},

categorySchema.pre('save', function(next){
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;