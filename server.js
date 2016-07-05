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

// define a schema
var contactSchema = new Schema({
	name: String,
	email: String,
	number: String
});

// pubish the schema as model, will create a collection with name 'contacts'
var contactListModel = mongoose.model('contact', contactSchema);

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


// // Update contact info
// // put /contacts/:id


// // Delete one contact
// // delete /contacts/:id

