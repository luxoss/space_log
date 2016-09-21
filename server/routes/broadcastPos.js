var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var file = 'space_log.txt';

var username, x, y;


UsersPio.on('connection', function(socket){
	console.log('This is a allUserPos.js file');
	/*
	socket.on('cpos_req', function(data){
		console.log("I get a request that all of users' positions");
		
		username = data.username;
		x = data.location_x;
		y = data.location_y;
		console.log("==============broadcastPos.js File ==============");
		console.log("username : " + username);
		console.log("location_x : " + x);
		console.log("location_y : " + y);
		console.log("================================================");
		var allUPosObj = {"username" : username, "location_x" : x, "location_y" : y};
		

		socket.broadcast.to('playing').emit('cpos_res', allUPosObj);
		
		

	});

	*/
	socket.on('press_key', function(data){
		console.log("Client press arrow key");
		var mv_obj;
		var username=data.username, x=data.location_x, y=data.location_y;
		console.log("username : " + username + "x : " + x + "  Y : " + y);
		var LEFT=37, UP=38, RIGHT=39, DOWN=40;
		switch(data.key_val){
		case LEFT:
			x -= 10;
			break;
		case UP:	
			y -= 10;
			break;
		case RIGHT:
			x += 10;
			break;
		case DOWN:
			y += 10;
			break;
		default:
			break;
		}
		mv_obj = {"username":username, "location_x":x, "location_y":y};		
		console.log('mv_obj : ' + mv_obj.username + " " + mv_obj.location_x + " " + mv_obj.location_y +".");
		UsersPio.sockets.in('playing').emit('mv',mv_obj);

	});

});



console.log('broadcastPos.js : http://203.237.179.21:5006');
