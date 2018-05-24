var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ticketSchema = new Schema({

	ticketId : { type : String },
	username : { type : String },
	email : { type : String },
	title : { type : String },
	description : { type : String },
	status : { type: String, default : 'open' },
	filename : { type : String },
	messages : [{
		sender: { type : String },
		message: { type : String },
		created: { type : Date, default : Date.now }
	}],
	created: { type : Date,	default : Date.now }
});

var ticketModel = module.exports = mongoose.model('ticketModel', ticketSchema);