
var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var file = 'space_log.txt';

var objects = {};
var mv_obj={};
var username="", key_val=0, x=0, y=0;
var LEFT=37, UP=38, RIGHT=39, DOWN=40;

UsersPio.on('connection', function(socket){
	
	socket.on('press_key', function(data){
	
		console.log("Client press arrow key");
		console.log(data.ready);
		username=data.username;
		x=data.location_x;
		y=data.location_y;
		key_val=data.key_val
		console.log("username : " + username + "  x : " + x + "  Y : " + y);
		
		console.log('=============== key_val : ' + key_val +"============");
		
		if(key_val == LEFT){
		//	objects[socket.id].status.x -= 10;
			x -= 10;

		} else if(key_val == UP){
		//	objects[socket.id].status.y -= 10;
			y -= 10;
		} else if(key_val == RIGHT){
		//	objects[socket.id].status.x += 10;
			x += 10;
		} else if(key_val == DOWN){
		//	objects[socket.id].status.y += 10;
			y += 10;
		} else{
			//nothing
		}
		
		mv_obj = {
			"location_x" : x, 
			"location_y" : y,
			"username" : username,
			"key_val" : key_val
		};

	UsersPio.emit('mv', mv_obj);
//	socket.emit('background_mv', {'b_m_top' : y, 'b_m_left' : x});

	});

});


/*
function UserObj(){
	
	this.status = {};
	this.status.x = 0;
	this.status.y = 0;
	this.status.username = "";
	this.keypress = [];
}
*/

console.log('broadcastPos.js : http://203.237.179.21:5006');

