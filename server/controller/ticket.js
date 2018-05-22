var ticketRouter = require('express').Router();
var mongoose = require('mongoose');
var events = require('events');
var nodeMailer = require('nodemailer');
var random = require('randomstring');
var fs = require('fs');
var multer = require('multer');
var config = require('./../config/config.js');
var userModel = require('./../model/userModel.js');
var ticketModel = require('./../model/ticketModel.js');
var resGen = require('./../libraries/error.js');
var auth = require('./../middlewares/auth.js');


var eventEmitter = new events.EventEmitter();

eventEmitter.on('adminMail', function(data){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: config.username,
			pass: config.pass
		}
	});
	var mailOptions ={
		from: '',
		to: data.user,
		subject: 'Admin Message',
		html: 'Hello,<br> A new message has been received from admin, regarding your query. Please login and check whether your query with id <span style="color:red"> ${data.id}</span>, is resolved or not.</p>'
	};
	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}
		else{
			console.log(info);
		}
	});
});

eventEmitter.on('userMessage', function(data){

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: config.username,
			pass: config.pass
		}
	});

	var mailOptions = {
		from: 'Support system <config.username>',
		to: req.body.email,
		subject:'',
		html: ''
	};

	transporter.sendmail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}
		else{
			console.log(info);
		}
	});
});

eventEmitter.on('ticketClose', function(data){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.username,
			pass: config.pass
		}
	});

	var mails = [data.email, "unnatidave11@gmail.com"];
	var mailList = mail.toString();
	console.log(mailList);

	var mailOptions = {
		from: 'Support System<unnatidave112gmail.com>',
		to: mailList,
		subject: 'Status Changed',
		html: '<p> Hello, your query with id is change'
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}
		else{
			console.log(info);
		}
	});
});



ticketRouter.use(function(req, res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Header","Origin, Content-Type, Accept");
	next();
});

var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './../uploads/')
	},
	filename: function(req, file, cb){
		var datetime = Date.now();
		cb(null, file.fieldname + '-' + datetime + '-' + file.originalname.split('.')[file.originalname.split('.').length - 1])
	}
});

var upload = multer({
	storage: storage
}).single('file');

ticketRouter.post('/upload', function(req, res){
	upload(req, res, function(err){
		if(err){
			res.json({
				error_code:1,
				err_desc: err
			});
			return;
		}
		res.json({
			error_code: 1,
			err_desc: null,
			data: req.file.fileame
		});
	});
});

ticketRouter.get('/dowload/:id', function(req, res){
	var file = './../uploads' + req.params.id;
	if(fs.existsSync(file)){
		res.download(file);
	}
	else{
		res.send("<h2>404, File not found. </h2>");
	}
});

//ticketRouter.use();

ticketRouter.post('/create',auth.auth, function(req, res){

	var newTicket = new Ticket({
		ticketId: random.generate(10),
		email: req.user.email,
		userName: req.user.firstName + ' ' + req.user.lastName,
		title: req.body.title,
		description: req.body.description,
		fileName: req.body.fileName
	});

	newTicket.save(function(err){
		if(err){
			var res= resGen.generate(true, "Some error occured", 500, null);
			ress.send(res);
		}
		else{
			var res = resGen.generate(false, "Ticket Created Successfully",200, newTicket);
			res.send(res);
		}
	});
});

ticketRouter.get('/ticket/:id', function(req, res){

	ticketModel.findOne({
		ticketId: req.params.id
	}, function(err,result){
		if(err){
			var res = resGen.geerate(true, "Some error occured", 500, null);
			res.send(res);
		}
		else{
			var res = resGen.generate(false, " Ticket Info", 200, result);
			res.send(res);
		}
	});
});

ticketRouter.get('/tickets', function(req, res){
	ticketModel.find({
		email: req.user.email
	}, function(err, result){
		if(err){
			var res = resGen.generate(true,"Some error occured", 500, null);
			res.send(res);
		}
		else{
			var res = resGen.generate(flase, "Ticket Info", 200, result);
			res.send(res);
		}
	});
});

ticketRouter.get('/admin/tickets', function(req, res){
	ticketModel.find({}, function(err,result){
		if(err){
			var res= resGen.generate(true, "Some error occured",500, null);
		}
		else{
			var res = resGen.generate(false, "All Tickets info", 200, result);
			res.send(res);
		}
	});
});

ticketRouter.post('/ticket/statusChange/:id', function(req, res){
	var data = {
		id: req.paeams.id,
		email: req.body.email
	};
	ticketModel.findOnceAndUpdate({
		ticketId: req.params.id
	}, {
		$set: {
			status: "close"
		}
	}, function(err){
		if(err){
			var res = resGen.generate(true, "Some error occured", 500, null);
			res.send(res);
		}
		else{
			var res = resGen.generate(false, "Ticket Deleted successfully",200, null);
			res.send(res);
		}
	});
});

ticketRouter.post('/message/:id', function(req, res){
	var message = {
		sender: req.user.firstName + ' ' + req.user.lastName,
		message: req.body.message 
	};

	ticketModel.findOnceAndUpdate({
		ticketId: req.params.id
	},{
		$push: {
			"message": message
		},
	}, function(err){
		if(err){
			var res = resGen.generate(true, "Some error occured", 500, null);
			res.send(res);
		}
		else{
			var resGen = generate(false, "Message sent", 200, null);
			res.send(res);
		}
	});
});


ticketRouter.post('/admin/message/:id', function(req, res){

	var data ={
		user: req.body.username,
		id: req.body.id
	};

	var message = {
		sender: "Admin",
		message: req.body.message
	};
	ticketModel.findOnceAndUpdate({
		ticketId: req.params.id
	}, {
		$push: {
			"messages": message
		}
	}, function(err){
		if(err){
			var res = resGen.generate(true, "Some error occured", 500, null);
			res.send(res);
		}
		else{
			eventEmitter.emit('adminMsg', data);
			var res = resGen.generate(false, "MEssage sent from Admin", 200, null);
			res.send(res);
		}
	});
});

module.exports = ticketRouter;