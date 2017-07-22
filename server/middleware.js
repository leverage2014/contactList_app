var cryptojs = require('crypto-js');
var util = require('./util')();

module.exports = function(tokenModel, userModel){
	return {
		requireAuthentication: function(req, res, next){
			var token = req.get('Auth') || '';
			//var tokenHash = cryptojs.MD5(token).toString();
			util.findUserByToken(token, tokenModel, userModel).then(function(user){
				console.log(user);
				req.user = user;
				
				next();
			}, function(err){
				console.log(err);
				res.status(500).send();
			});

			// tokenModel.findOne({
			// 	tokenHash: token
			// }, function(err, token){
			// 	if(err){
			// 		res.status(401).send();
			// 	} else {
			// 		userModel.findOne({
			// 		     token: token
			// 		}, function(err, user){
			// 			if(err){
			// 				res.status(401).send();
			// 			}else{
			// 			    req.user = user;
			// 			}
			// 		});				
			// 	}

			// });
		}
	}
}