var userRouter = require('express').Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var random = require('randomstring');
var events = require('events');

var userModel = require('./../model/userModel.js');
var resGen = require('./../libraries/error.js');
var config = require('./../config/config.js');
var eventEmitter = new events.EventEmitter();

//Cerate nodemailer to send welcome mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth :{
        user: 'testecommerce98@gmail.com',
        pass: 'support@123'
    }
});
// for welcome message
eventEmitter.on('welcomeMessage', function(data){
        var mailOptions = {
            from: 'testecommerce98@gmail.com',
            to: data.email,
            subject: 'Welcome to Support System',
            html: '<h2>Hi ' + data.firstName + ',</h2><h2> Thank you for choosing us.</h2> <h4> We provide you the best support service </h4>'
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
});	//end welcome message

// mail for password change
eventEmitter.on('passChange', function(data){
        var mailOptions = {
            from: 'testecommerce98@gmail.com',
            to: data.email,
            subject: 'Password Change alert',
            html: '<h2>Hi , </h2><h2> Your Password is: ' + data.password + '</h4>'
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log(info);
            }
        });
});			//end password change

userRouter.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

// for register
userRouter.post('/register', function(req, res){

	userModel.findOne({
		'email': req.body.email
	},function(err, result){
		if(err){
			var response = resGen.generate(true, "Some Error Occured", 500, null);
			res.send(response);
			console.log(response);
		}
		else if(result){
			var response = resGen.generate(true,"User already exists", 409, null);
			console.log(result);
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
							console.log(response);
							res.send(response);
							
						}
						else{
							var response = resGen.generate(true, "Account Created Successfully",200, null);
							eventEmitter.emit('welcomeMessage', newUser);
							console.log(response);
							res.send(response);
						}
					});
				});
			});
		}
	});
});			// end register

//for login
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
				if(err) throw err;
				if(isMatch){
					console.log(config.secret);
					var payload = result.toObject();
					delete payload.password;
					var token =  jwt.sign(payload, config.secret,{
						expiresIn: 45 * 60
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
});		//end login

// for forgotpassword
userRouter.post('/forgotPass', function(req, res){
	var data= {
		email : req.body.email,
		password : req.body.password
	};
	userModel.findOne({
		'email': req.body.email
	}, function(err,result){
		if(err){
			var response = resGen.generate(true, "Some error Occured", 500, null);
			res.send(response);
		}
		else if(result == null){
			var response = resGen.generate(true, "User not Found OR Invalid User Name",409, null);
			res.send(response);
		}
		else {
			var password = req.body.password;
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(password, salt, function(err, hash){
					password = hash;
					userModel.findOneAndUpdate({
						email: req.session.email
					},{
                		$set: {
                    		password: password
                    	}
	                }, function(err, doc){						
						if(err){
							var response = resGen.generate(true, "Some error Occured", 500, null);
							res.json(response);
						}
						else{
							var response=resGen.generate(false, "Password change Successfully",200, null);
							eventEmitter.emit('passChange',data);
							res.json(response);
						}
					}); //User model find and update end
		    	}); ///end bcryptHash
			}); //end bcrypt
		} //end else
	}); //end userModel
});		//end forgot password
module.exports = userRouter;
