//http://mongoosejs.com/docs/populate.html
//http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_email: {type: String, required: true, unique: true},
	name: String,
	location: String,
	date_created: Date,
	date_updated: Date,
	status: Boolean,
	things: [{type: Schema.Types.ObjectId, ref: 'Thing'}]
});

userSchema.pre('save', function(next){
	var current_date = new Date();
	this.date_updated = current_date;
	if(!this.date_created){
		this.date_created = current_date;
	}
	return next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;