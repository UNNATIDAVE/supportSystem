var userRouter = require('express').Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var random = require('randomstring');
var events = require('events');

var userModel = require('./../model/userModel.js');
var resGen = require('./../libraries/error.js');
var config = require('./../config/config.js');
var eventEmitter = new events.EventEmitter();

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'testecommerce98@gmail.com',
        pass: 'support@123'
	}
});
eventEmitter.on('welcomMessage', function(msg){
	var mailOptions = {
		from: 'testecommerce98@gmail.com',
		to: msg.email,
		subject: "Welcome" + msg.firstName,
		html: '<h2>Hi'+message.firstName +',</h2><h2> Thank you for choosing us.</h2> <h4> Your Email ID : </h4>' + message.description.email + ' <h4> Your Password : </h4>' + message.description.password
        };

        transporter.sendMail(mailOption, function(err, info){
        	if(err){
        		console.log(err);
        	}
        	else{
        		console.log(info);
        	}
        });
});
userRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

userRouter.post('/register', function(req, res){

	userModel.findOne({
		'email': req.body.email
	},function(err, result){
		if(err){
			var response = resGen.generate(true, "Some Error Occured", 500, null);
			res.send(response);
		}
		else if(result){
			var response = resGen.generate(true,"User already exists", 409, null);
			res.send(response);
		}
		else{
			var newUser = new userModel({
				firstName: req.body.firstName,
				lastName : req.body.lastName,
				email: req.body.email,
				mobile: req.body.mobile,
				password: req.body.password
			});

			bcrypt.genSalt(10, function(err,salt){
				bcrypt.hash(newUser.password, salt, function(err, hash){
					newUser.password = hash;
					newUser.save(function(err){
						if(err){
							var response = resGen.generate(true, "Some error Occured",500, null);
							res.send(response);
						}
						else{
							var token = jwt.sign({
						email: newUser.email,
						firstName: newUser.firstName,
					}, config.secret);
							var response = resGen.generate(true, "Account Created Successfully",200, null);
							eventEmitter.emit("welcomMessage", newUser);
							response.token =token;
							res.json(response);
						}
					});
				});
			});
		}
	});
});


userRouter.post('/login', function(req, res){
	userModel.findOne({
		'email': req.body.email
	}, function(err,result){
		if(err){
			var response = resGen.generate(true, "Some error Occured", 500, null);
			res.send(response);
		}
		else if(result == null){
			var response = resGen.generate(true, "Invalid user name",409, null);
			res.send(response);
		}
		else if(result){
			bcrypt.compare(req.body.password, result.password, function(err,isMatch){
				if(err){
					res.send(err);
				}
				if(isMatch){
					console.log(config.secret);
					var payload = result.toObject();
					delete payload.password;
					var token =  jwt.sign(payload, config.secret,{
						expiresIn: 30*60
					});
					res.json({
						error: false,
						token: token
					});
				}
				else if(!isMatch){
					var response = resGen.generate(true,"Invalid Password", 500, null);
					res.send(response);
				}
			});
		}
	});
});


userRouter.post('/forgotPass', function(req, res){
	var email = req.body.email;
	req.session.email = email;
	req.session.shortid = random.generate(7);
	console.log(req.session.shortid);
	eventEmitter.emit('send-unique', {
		email: email,
		id: req.session.shortid
	});
	var response = resGen.generate(false, "Unique ID sent sucessfully", 200, req.session.shortid);
	res.json(response);
});

userRouter.get('/verify-unique', function(req, res){
	var id = req.query.otp;
	if(id === req.session.shortid){
		var response = resGen.generate(false,"Unique ID matched", 200, req.session.shortid);
		res.json(response);
	}
	else{
		var response = resGen.generate(true,"Unique ID didn't match", 200, null);
		res.json(response);
	}
});

userRouter.post('/reset-password', function(req, res){
	var password = req.body.password;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(password, salt, function(err, hash){
			password = hash;
			userModel.findOneAndUpdate({
				email: req.session.email
			}, function(err, doc){
				if(err){
					var response = resGen.generate(true, "Some error Occured", 500, null);
					res.json(response);
				}
				else{
					var response=resGen.generate(false, "Password change Successfully",200, null);
					res.json(response);
				}
			});
		});
	});
});
module.exports = userRouter;