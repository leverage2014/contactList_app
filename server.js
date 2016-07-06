var _ = require('underscore');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;
app.use('/', express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Obtain all connections to the DB
var connections = mongoose.connect('mongodb://contactList:12345abcde@ds051575.mlab.com:51575/heroku_c0httc0j').connections;
// Obtain current connection
var connection = connections[0];
// Obtain the db;
var db = connection.db;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected');

  app.listen(PORT, function(){
	console.log('Server is running at port: ' + PORT);
  });

});

// define contact schema
var contactSchema = new Schema({
	name: String,
	email: String,
	number: String,
	userId: String
});

// define user schema
var userSchema = new Schema({
	email: String,
	password_hash: String,
	salt: String
});

// define token schema
var tokenSchema = new Schema({
	tokenHash: String
});

// pubish the schema as model, will create a collection with name 'contacts'
var contactListModel = mongoose.model('contact', contactSchema);
// pubish the schema as model, will create a collection with name 'users'
var userModel = mongoose.model('user', userSchema);
// pubish the schema as model, will create a collection with name 'tokens'
var tokenModel = mongoose.model('token', tokenSchema);

app.get('/', function(req, res){
	console.log('GET request received!');
});

// // Get all contacts info.
// // get /contacts
app.get('/contacts', function(req, res){

 	contactListModel.find(function(err, contacts){
		if(err){
			res.status(401).send();
		} else {
		    res.json(contacts);
		}	 	
 	});

});

// // Add new contact
// // post /contacts
app.post('/contacts', function(req, res){
   var body = _.pick(req.body, 'name', 'email', 'number');
   console.log(body.name);

   contactListModel.find({name: body.name}, function(err, contact){
		if(err){
			res.status(500).send();
		}else{
			if(_.isEmpty(contact)){
			   
				var contactEntity = new contactListModel({
					name: body.name,
					email: body.email,
					number: body.email
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
app.put('/contacts/:id', function(req, res){
    
    var recordId = req.params.id;
    var body = _.pick(req.body, 'name', 'email', 'number');

    contactListModel.find({_id: recordId}, function(err, contact){
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
app.delete('/contacts/:id', function(req, res){

	var recordId = req.params.id;
	contactListModel.remove({_id: recordId}, function(err, result){
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
			   
				var userEntity = new userModel({
					email: body.email,
					password: body.password  // plain-text password!
				});

				userEntity.save(function(err, user){
					if(err){
						res.status(500).send();
					}else{
						res.json(user);
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

});

