var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');

module.exports = function(){
	return {
		toPublicJSON: function(data){
			var json = data.toJSON();
			return _.pick(json, '_id', 'email');
		},

		encryptPassword: function(plain_password){
			var salt = bcrypt.genSaltSync(10);
			var hashedPassword = bcrypt.hashSync(plain_password, salt);

			return {
				salt: salt,
				hashedPassword: hashedPassword
			};
		},

		authenticated: function(body, userModel){
			return new Promise(function(resolve, reject){
				if(typeof body.email !== 'string' || typeof body.password !== 'string'){
					return reject();
				}

				userModel.find({
					email: body.email
				}, function(err, users){

					if(err){
						return reject();
					} else {
						if(_.isEmpty(users) || !bcrypt.compareSync(body.password, users[0].password_hash)){
						     return reject(undefined);
					    }
					    resolve(users[0]);	
					}
				});
			});
		},

		generateToken: function(data, type){
			if(!_.isString(type)){
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
		},

		findUserByToken: function(token, tokenTable, userTable){
			
			return new Promise(function(resolve, reject){

				tokenTable.find({
					tokenHash: token
				}, function(err, tokenInstances){
					console.log(tokenInstances);

					if(_.isEmpty(tokenInstances)){
						return reject('Not valid token!');
					}
					console.log('find user');
				//return new Promise(function(resolve, reject){
    				try{
    					var decodeJWT = jwt.verify(token, 'token123');
    					var bytes = cryptojs.AES.decrypt(decodeJWT.token, 'abc123!@');
    					var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

    					console.log('enter here');
    					console.log(tokenData);

    					userTable.findOne({
    						_id: tokenData.data
    					}, function(err, user){
    						if(err){
    							return reject();
    						}else{
    							resolve(user);
    						}
    					});
    				}catch(e){
    					reject();
    				}
    			}); 

			});
		}
	}
}