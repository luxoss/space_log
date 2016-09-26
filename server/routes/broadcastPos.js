
var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

var fs = require('fs');
var file = 'space_log.txt';

var objects = {};
var mv_obj;
var username, key_val, x, y;
var LEFT=37, UP=38, RIGHT=39, DOWN=40;

UsersPio.on('connection', function(socket){
	//objects[socket.id] = new UserObj(x, y, username);
	/*
	socket.on('press_key', function(data){
		console.log("Client press the arrow key");
		username = data.username;
		x=data.location_x;
		y=data.location_y;
		key_val = data.key_val;

		if(key_val == LEFT){
			x -=10;
		} else if (key_val == UP){
			y -= 10;
		} else if (key_val == RIGHT){
			x += 10;
		} else if (key_val == DOWN){
			y += 10;
		} else { // nothing
			console.log("don't calculate");
		}
		mv_obj = {"username" : username, "location_x" : x, "location_y" : y}

		socket.broadcast.to('playing').emit('mv', mv_obj);
	});*/
	
//	var update = setInterval(function(){
//	var idArray = [];
//	var statusArray = {};
	
	socket.on('press_key', function(data){
	
		console.log("Client press arrow key");
		username=data.username;
		x=data.location_x;
		y=data.location_y;
		key_val=data.key_val
		console.log("username : " + username + "  x : " + x + "  Y : " + y);
		
		//objects[socket.id] = new UserObj();
		//objects[socket.id].status.x = x;
		objects[socket.id] = function(){
			this.status = {};
			this.status.x;
			this.status.y;
			this.status.username;
			this.status.keypress;
		};
		
		objects[socket.id].status = new Object();
		objects[socket.id].status.x = x;
		objects[socket.id].status.y = y;
		objects[socket.id].status.username = username;
		objects[socket.id].status.keypress = key_val;
	
		console.log(":::::::: " + objects[socket.id].status.x + " :::::");
		console.log('=============== key_val : ' + key_val +"============");
		
		if(key_val == LEFT){
			objects[socket.id].status.x -= 10;
		} else if(key_val == UP){
			objects[socket.id].status.y -= 10;
		} else if(key_val == RIGHT){
			objects[socket.id].status.x += 10;
		} else if(key_val == DOWN){
			objects[socket.id].status.y += 10;
		} else{
			//nothing
		}

		UsersPio.sockets.in('playing').emit('mv', objects[socket.id].status);

		/*
		var update = setInterval(function(){
			var idArray=[];
			var statusArray={};
			for(var id in UsersPio.sockets.clients().connected){	
				
				//console.log("id :::::::   " + id);
				//console.log(objects[id].status.x);
			
			}
		}, 30);*/
		//	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + objects[id].status + "!!!!!!!!!!!!!!!!!!!!!!!!!!");
		/*	
		switch(key_val)
		{
			case LEFT:
				//x -= 10;
				objects[id].status.x -= 10;
				break;
			case UP:	
				//y -= 10;
				objects[id].status.y -= 10;
				break;
			case RIGHT:
				//x += 10;
				objects[id].status.x += 10;
				break;
			case DOWN:
				//y += 10;
				objects[id].status.y += 10;
				break;
			default:
				break;
		}
			idArray.push(id);
			statusArray[id]=objects[id].status;
		}
		UsersPio.emit('mv', idArray, statusArray);*/
		//mv_obj = {"username":username, "location_x":x, "location_y":y};		
		//console.log('mv_obj : ' + mv_obj.username + " " + mv_obj.location_x + " " + mv_obj.location_y +".");
//		UsersPio.emit();
		//UsersPio.sockets.in('playing').emit('mv',mv_obj);
		//UsersPio.sockets.emit('mv',mv_obj);
		//socket.broadcast.to('playing').emit('mv', mv_obj);
		//socket.broadcast.emit('mv', mv_obj);
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

