var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var file = 'space_log.txt';

var username, x, y;


UsersPio.on('connection', function(socket){
	console.log('This is a allUserPos.js file');
	socket.on('cpos_req', function(data){
		console.log("I get a request that all of users' positions");
		username = data.username;
		x = data.location_x;
		y = data.location_y;
		console.log("==============allUsersPos.js File ==============");
		console.log("username : " + username);
		console.log("location_x : " + x);
		console.log("location_y : " + y);
		console.log("================================================");
		var allUPosObj = {"username" : username, "location_x" : x, "location_y" : y};

	socket.broadcast.to('playing').emit('cpos_res', allUPosObj);
	});

});



console.log('allUsersPos.js : http://203.237.179.21:5006');
