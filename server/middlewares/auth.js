var jwt = require('jsonwebtoken');
var resGen = require('./../libraries/error.js');
var config = require('./../config/config.js');

module.exports.auth = function(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log(token);

	if(token){
		jwt.verify(token, config.secret, function(err, decoded){
			if(err){
				var response = resGen.generate(true, "Failed to Authenticate", 403, null);
				res.json(response);
			}
			else{
				req.user = decoded;
				console.log(decoded);
				next();
			}
		});
	}
	else{
		return res.status(403).send({
			success: false,
			message: "No Token provided...."

		});
		console.log("no oken provided");
	}
};