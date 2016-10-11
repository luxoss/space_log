
var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;
//test
//var CollisionPio = io.connect("http://203.237.179.21:5007");
//var getMongoClient = require('./loginForm');

var fs = require('fs');
var file = 'space_log.txt';

var speed = 10;

var objects = {};
var mv_obj={};
var username="", key_val=0, x, y;
var LEFT=37, UP=38, RIGHT=39, DOWN=40, ENTER=13;

UsersPio.on('connection', function(socket){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var mem_info = db.collection("MEM_INFO");
		var member = db.collection("MEMBER");
		
		socket.on('press_key', function(data){	
			username = data.username;
			x = data.location_x;
			y = data.location_y;
			key_val = data.key_val;

			mv_obj = {
				"username" 	: username,
				"location_x" 	: x,
				"location_y" 	: y,
				"key_val" 	: key_val
			};

			switch(mv_obj.key_val){
			case LEFT:
		
				mv_obj.location_x -= speed;
				break;
			case UP:
				
				mv_obj.location_y -= speed;
				break;
			case RIGHT:
				
				mv_obj.location_x += speed;
				break;
			case DOWN:
				
				mv_obj.location_y += speed;
				break;
			default : 
			}
		
			mem_info.update({"username":username}, {$set : { "location_x" : mv_obj.location_x, "location_y" : mv_obj.location_y, "key_val" : mv_obj.key_val }});

			//test code
		//	CollisionPio.emit('collision_req', mv_obj);

			UsersPio.emit('mv', mv_obj);
			

		});
/*
		socket.on('init_press_key', function(data){
			console.log("[SERVER LOG] Init press key.");
			console.log(key_val);

			username = data.username;
			x = data.location_x;
			y = data.location_y;
			key_val = data.key_val;

			if(key_val == ENTERi){
				console.log("[SERVER LOG] Sample press enter.");

				member.find({"accessing" : "true"}).toArray(function(err, results){
					if(err){
					
					} else if(res_obj){
						console.log(results);
					}
				});				
			}
		});      */
	});
});

console.log("broadcastPos.js : http://203.237.179.21:5006");
