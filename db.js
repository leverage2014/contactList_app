var mongoose = require('mongoose');

module.exports = function(){

	var Schema = mongoose.Schema;

	// Obtain all connections to the DB
	var connections = mongoose.connect('mongodb://contactList:12345abcde@ds051575.mlab.com:51575/heroku_c0httc0j').connections;
	// Obtain current connection
	var connection = connections[0];
	// Obtain the db;
	var db = connection.db;

	// db.on('error', console.error.bind(console, 'connection error:'));
	// db.once('open', function() {
	//   console.log('We are connected');

	//   app.listen(PORT, function(){
	// 	console.log('Server is running at port: ' + PORT);
	//   });

	// });

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


	return {
		db: db,
		contactListModel: contactListModel,
		userModel: userModel,
		tokenModel: tokenModel
	}
}
