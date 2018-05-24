var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({

	firstName : { type: String},
	lastName : { type: String },
	email: { type: String },
    mobile: { type: String },
    password: { type: String }
});

var userModel = module.exports = mongoose.model('userModel', userSchema);