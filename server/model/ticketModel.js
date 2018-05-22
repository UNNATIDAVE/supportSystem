var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ticketSchema = new Schema({

	ticketId : { type : String },
	userName : { type : String },
	email : { type : String },
	title : { type : String },
	description : { type : String },
	status : { type: String, default : 'open' },
	fileName : { type : String },
	message : [{
		sender: { type : String },
		message: { type : String },
		created: { type : Date, default : Date.now }
	}],
	created: { type : Date,	default : Date.now }
});

mongoose.model('ticket', ticketSchema);