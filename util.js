var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');

module.exports = function(){
	return {
		encryptPassword: function(plain_password){
			var salt = bcrypt.genSaltSync(10);
			var hashedPassword = bcrypt.hashSync(plain_password, salt);

			return {
				salt: salt,
				hashedPassword: hashedPassword
			};
		},

		authenticated: function(body, userModel){
			return new Promise(function(resovle, reject){
				if(typeof body.email !== 'string' || typeof body.password !== 'string'){
					return reject();
				}

				userModel.find({
					email: body.email
				}, fuction(err, user){
					if(err){
						reject();
					} else {
						if(!user || !bcrypt.compareSync(body.password, user.password_hash)){
						     return reject();
					    }
					    resolve(user);	
					}
				});
			});
		},

		generateToken: function(type, data){
			if(_.isString(type)){
				return undefined;
			}

			try{
				var stringData = JSON.stringify({data: data, type:type});
				var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@').toString();

				var token = jwt.sign({
					token: encryptedData
				}, 'token123');

				return token;
			}catch(e){
				return undefined;
			}
		}
	}
}