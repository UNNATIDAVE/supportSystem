var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

	firstName : { type: String, default: '', required: true },
	lastName : { type: String },
	password: { type: String }, 
	email : { type: String },
	mobile : { type: String }
});

mongoose.model('user', userSchema);