var _ = require('underscore');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mydb = require('./db')();
var util = require('./util')();

var db = mydb.db;
var contactsModel = mydb.contactListModel;
var userModel = mydb.userModel;
var tokenModel = mydb.tokenModel;

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
		res.json(util.toPublicJSON(user));
	}, function(err){
		res.status(401).send();
	});

});

