var _ = require('underscore');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mydb = require('./db')();
var util = require('./util')();

var db = mydb.db;
var contactListModel = mydb.contactListModel;
var userModel = mydb.userModel;
var tokenModel = mydb.tokenModel;

var middleware = require('./middleware')(tokenModel, userModel);

var PORT = process.env.PORT || 3000;
app.use('/', express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');
  
  app.listen(PORT, function(){
  	console.log('Server is running at port: ' + PORT);
  });

});

app.get('/', middleware.requireAuthentication, function(req, res){
	console.log('GET request received!');
});

// // Get all contacts info.
// // get /contacts
app.get('/contacts', middleware.requireAuthentication, function(req, res){
	var user = req.user;

 	contactListModel.find({userId: user._id}, function(err, contacts){
		if(err){
			res.status(401).send();
		} else {
		    res.json(contacts);
		}	 	
 	});

});

// // Add new contact
// // post /contacts
app.post('/contacts', middleware.requireAuthentication, function(req, res){
   var body = _.pick(req.body, 'name', 'email', 'number');
   console.log(body.name);

   var user = req.user;
   var userId = user._id;

   contactListModel.find({
   		name: body.name,
   		userId: userId
   	}, function(err, contact){
		if(err){
			res.status(500).send();
		}else{
			if(_.isEmpty(contact)){
			   
				var contactEntity = new contactListModel({
					name: body.name,
					email: body.email,
					number: body.email,
					userId: user._id
				});

				contactEntity.save(function(err, contact){
					if(err){
						res.status(500).send();
					}else{
						res.json(contact);
					}
				});

		    }else{
			   res.status(401).send('duplicated name found!');
		    }
		}	
 	});
});

// // Update contact info
// // put /contacts/:id
app.put('/contacts/:id', middleware.requireAuthentication, function(req, res){
    
    var recordId = req.params.id;
    var body = _.pick(req.body, 'name', 'email', 'number');
    
    var user = req.user;
    var userId = user._id;

    contactListModel.find({
    	_id: recordId,
    	userId: userId
    }, function(err, contact){
    	if(err){
    		res.status(500).send();
    	} else {
    		contactListModel.update(
    			{_id:recordId},
    			{$set:
    				{
    					name: body.name,
    					email: body.email,
    					number: body.number
    				}
    			},function(err){
    				res.status(500).send();
    			});
    		res.json(body);
    	}	
    });
});

// // Delete one contact
// // delete /contacts/:id
app.delete('/contacts/:id', middleware.requireAuthentication, function(req, res){

	var recordId = req.params.id;

	var user = req.user;
    var userId = user._id;

	contactListModel.remove({
		_id: recordId,
		userId: userId
	}, function(err, result){
		if(err){
			res.status(500).send();
		}else{
			res.json(result);
		}
	 });
});


// POST /users
app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	userModel.find({email: body.email}, function(err, user){
		if(err){
			res.status(500).send();
		}else{
			if(_.isEmpty(user)){
			   
			   var encryptedPwd = util.encryptPassword(body.password);

				var userEntity = new userModel({
					email: body.email,
					password_hash: encryptedPwd.hashedPassword,
					salt: encryptedPwd.salt
				});

				userEntity.save(function(err, user){
					if(err){
						res.status(500).send();
					}else{
						res.json(util.toPublicJSON(user));
					}
				});

		    }else{
			   res.status(401).send('duplicated email found!');
		    }
		}	
 	});
});

// POST /users/login
app.post("/users/login", function(req, res){

	var body = _.pick(req.body, 'email', 'password');

	util.authenticated(body, userModel).then(function(user){
		console.log('verified');
		var token = util.generateToken(user._id, 'authentication');

		var tokenEntity = new tokenModel({
			tokenHash: token
		});
		tokenEntity.save(function(err, token){
			console.log(token);
			if(err){
				res.status(500).send();
			}else{
				res.header('Auth', token.tokenHash).json(util.toPublicJSON(user));
			}
		});
	}, function(err){
		res.status(401).send();
	});
});

// DELETE /users/logout
app.delete('/users/logout', middleware.requireAuthentication, function(req, res){
	var token = req.get('Auth');
	if(typeof token === 'undefined'){
		res.status(401).send();
	}

	tokenModel.remove({
		tokenHash: token
	}, function(err, token){
		if(err){
			res.status(500).send();
		}else{
			res.json(token);
		}
	});

});

