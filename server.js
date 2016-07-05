var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;

app.use('/', express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res){
	console.log('GET request received!');
});

app.listen(PORT, function(){
	console.log('Server is running at port: ' + PORT);
});
