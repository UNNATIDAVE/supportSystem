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

//Cerate nodemailer to send mails
var eventEmitter = new events.EventEmitter();
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth :{
        user: 'testecommerce98@gmail.com',
        pass: 'support@123'
    }
});

// mail for ticket updates
eventEmitter.on('ticketStatus', function(data){
        var mailOptions = {
            from: 'Support System <testecommerce98@gmail.com>',
            to: data.email,
            subject: 'Ticket Status Changed',
            html: '<p> Hello, <br> your query status is changed. Your Ticket ID is: ' +  data.ticketId +' </p>'
	};

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
});	//end status mail

// mail for new ticket
eventEmitter.on('addTicket', function(data){
        var mailOptions = {
            from: 'Support System <testecommerce98@gmail.com>',
            to: data.email,
            subject: 'Ticket Created successfully',
            html: '<p> Hello, <br> your query Posted successfully.<br> Your ticket ID is: </p>' + data.ticketId
	};

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
}); //end new ticket mail

ticketRouter.use(function(req, res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Header","Origin, Content-Type, Accept");
	next();
});

// for store the uploaded files
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/')
	},
	filename: function(req, file, cb){
		var datetime = Date.now();
		cb(null, file.fieldname + '-' + datetime + '-' + file.originalname.split('.')[file.originalname.split('.').length - 1])
	}
});

var upload = multer({
	storage: storage
}).single('file');


// for file upload
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
			error_code: 0,
			err_desc: null,
			data: req.file.filename
		});
	});
});		//end file upload
	
// for dowload file	
ticketRouter.get('/dowload/:id', function(req, res){
	var file = './uploads/' + req.params.id;
	if(fs.existsSync(file)){
		res.download(file);
	}
	else{
		res.send("<h2>404, File not found. </h2>");
	}
});

ticketRouter.use(auth.auth);

//for create new tickets
ticketRouter.post('/create', function(req, res){
	
	var newTicket = new ticketModel({
		ticketId: random.generate(10),
		email: req.user.email,
		userName: req.user.firstName + ' ' + req.user.lastName,
		title: req.body.title,
		description: req.body.description,
		filename: req.body.filename
	});

	newTicket.save(function(err){
		if(err){
			var response= resGen.generate(true, "Some error occured", 500, null);
			ress.send(response);
		}
		else{
			var response = resGen.generate(false, "Ticket Created Successfully",200, newTicket);
			eventEmitter.emit('addTicket', newTicket);
			res.send(response);
		}
	});
});	// end add tickets

//for single ticket view
ticketRouter.get('/ticket/:id', function(req, res){

	ticketModel.findOne({
		ticketId: req.params.id
	}, function(err,result){
		if(err){
			var response = resGen.geerate(true, "Some error occured", 500, null);
			res.send(response);
		}
		else{
			var response = resGen.generate(false, " Ticket Info", 200, result);
			res.send(response);
		}
	});
});		//end single ticket view


//for all tickets view
ticketRouter.get('/tickets', function(req, res){
	ticketModel.find({
		email: req.user.email
	}, function(err, result){
		if(err){
			var response = resGen.generate(true,"Some error occured", 500, null);
			res.send(response);
		}
		else{
			var response = resGen.generate(false, "Ticket Info", 200, result);
			res.send(response);
		}
	});
});	//end all ticket view

//for admin dashboard
ticketRouter.get('/admin/tickets', function(req, res){
	ticketModel.find({}, function(err,result){
		if(err){
			var response= resGen.generate(true, "Some error occured",500, null);
			res.send(response);
		}
		else{
			var response = resGen.generate(false, "All Tickets info", 200, result);
			res.send(response);
		}
	});
});	//end admin dashboard

// for status change
ticketRouter.post('/ticket/statusChange/:id', function(req, res){
	var data = {
		ticketId: req.params.id,
		email: req.user.email
	};
	ticketModel.findOneAndUpdate({
		ticketId: req.params.id
	}, {
		$set: {
			status: "close"
		}
	}, function(err){
		if(err){
			var response = resGen.generate(true, "Some error occured", 500, null);
			res.send(response);
		}
		else{
			var response = resGen.generate(false, "Ticket Status changed successfully",200, null);
			eventEmitter.emit('ticketStatus', data);
			res.send(response);
		}
	});
});		//end status change

//for delete ticket
ticketRouter.delete('/deleteticket/:id', function (req, res) {

    ticketModel.findOneAndRemove({
        ticketId: req.params.id
    }, function (err) {
        if (err) {
            var response = resGen.generate(true, "Some error", 500, null);
            res.send(response);
        } else {
            var response = resGen.generate(false, "Ticket Deleted", 200, null);
            res.send(response);
        }
    });
});	//end delete ticket

//for user message
ticketRouter.post('/message/:id', function(req, res){
	var message = {
		email: req.user.email,
		ticketId: req.params.id,
		sender: req.user.firstName + ' ' + req.user.lastName,
		message: req.body.message
	};
	console.log(message);

	ticketModel.findOneAndUpdate({
		ticketId: req.params.id
	},{
		$push: {
			"messages": message
		},
	}, function(err){
		if(err){
			var response = resGen.generate(true, "Some error occured", 500, null);
			res.send(response);
		}
		else{
			var response= resGen.generate(false, "Message sent", 200, null);
			res.send(response);
		}
	});
});	//end user message

//for admin message
ticketRouter.post('/admin/message/:id', function(req, res){

	var data ={
		user: req.body.username,
		id: req.params.id
	};
	console.log(data);

	var message = {
		sender: "Admin",
		message: req.body.message
	};
	ticketModel.findOneAndUpdate({
		ticketId: req.params.id
	}, {
		$push: {
			"messages": message
		}
	}, function(err){
		if(err){
			var response = resGen.generate(true, "Some error occured", 500, null);
			res.send(response);
		}
		else{
			var response = resGen.generate(false, "Message sent from Admin", 200, null);
			res.send(response);
		}
	});
});	//end admin message

module.exports = ticketRouter;