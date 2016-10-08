
var UsersPio = require('socket.io').listen(5006);
var MongoClient = require('mongodb').MongoClient;

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
			console.log("Client press arrow key");
			console.log(data.ready);
//			var mem_info = db.collection("MEM_INFO");
//			var member = db.collection("MEMBER");			
			username=data.username;
			x=data.location_x;
			y=data.location_y;
			key_val=data.key_val;

         if(key_val == LEFT) {
            //my_obj.x -= speed;
            x -= speed;
         }else if(key_val == UP) {
            //my_obj.y -= speed;
            y -= speed;
         }else if(key_val == RIGHT) {
            //my_obj.x += speed;
            x += speed;
         }else if(key_val == DOWN) {
            //my_obj.y += speed;
            y += speed;
         }else {
         }

			mem_info.update({"username":username}, {$set : {"location_x":x,"location_y":y, "key_val":key_val}});
			
			mem_info.findOne({"username":username}, function(err, res_info){
				if(err){
					 console.log('branch if : err');
					 console.log(err);
				} else if (res_info){
					mv_obj = {
						"username" 	: res_info.username,
						"location_x" 	: res_info.location_x,
						"location_y" 	: res_info.location_y,
						"key_val" 	: res_info.key_val
					};
				} else{
					console.log('branch else');
				}
			});

			UsersPio.emit('mv', mv_obj);
			
	
		//	UsersPio.emit('init_mv', mv_obj);
			
		//	UsersPio.emit('init_mv', mv_obj);
		});
		socket.on('init_press_key', function(data){
			console.log("akldsjflasjdlkfj;asdf/");
			console.log(key_val);
			username = data.username;
			x = data.location_x;
			y = data.location_y;
			key_val = data.key_val;


			if(key_val == ENTER){
				console.log("sample press enter");
				member.find({"accessing" : "true"}).toArray(function(err, results){
					if(err){
					
					} else if(res_obj){
						console.log(results);
					}
				});				
			}
		});

	});
});

console.log('broadcastPos.js : http://203.237.179.21:5006');

