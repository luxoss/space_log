var UsersPio = require('socekt.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

var username;


UserPio.on('connection', function(socket){
	console.log('This is a allUserPos.js file');
	socket.on('usersPos_req', function(data){
		console.log("I get a request that all of users' positions");
	});

});



console.log('allUsersPos.js : http://203.237.179.21:5006');
