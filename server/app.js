var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var morgan = require('morgan');
var session = require('express-session');
var cors = require('cors');
var config = require('./config/config.js');
app.use(cors());

app.use(bodyParser.json({
	limit : '100mb',
	extended : true
}));
app.use(bodyParser.urlencoded({
	limit : '100mb',
	extended : true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
	secret : "s3cr3t",
	resave : true,
	saveUninitialized : true
}));

// Database connection
mongoose.connect(config.db);
var db = mongoose.connection;

db.once('open', function(){
	console.log("Database connected successfully");
});

app.use(express.static(path.join(__dirname ,'./..')));

app.use('/', require('./controller/index.js'));

app.get('*', function(req, res, next){
	req.status = 404;
	next("Page not Found...");
});

app.use(function(err,req,res,next){
	res.send(err);
});

app.listen(3000, function(){
	console.log("Server listing on port 3000 !!!");
});
