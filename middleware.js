var cryptojs = require('crypto-js');

module.exports = function(tokenModel, userModel){
	return {
		requireAuthentication: function(req, res, next){
			var token = req.get('Auth') || '';
			//var tokenHash = cryptojs.MD5(token).toString();

			tokenModel.findOne({
				token: cryptojs.MD5(token).toString()
			}, function(err, token){
				if(err){
					res.status(401).send();
				} else {
					userModel.findOne({
					     token: token
					}, function(err, user){
						if(err){
							res.status(401).send();
						}else{
						    req.user = user;
						}
					});				
				}

			});
		}
	}
}