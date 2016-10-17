
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
var getP = {};

var username="", key_val=0, x, y, collistion;
var LEFT=37, UP=38, RIGHT=39, DOWN=40, ENTER=13;
var p_size = 100, s_size = 64;

var develop;

UsersPio.on('connection', function(socket){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var mem_info = db.collection("MEM_INFO");
		var mem_plan = db.collection("MEM_PLAN");
		var member = db.collection("MEMBER");
		var planet = db.collection("PLANET");

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


			UsersPio.emit('mv', mv_obj);

		});
		socket.on('collision_req', function(data){
			console.log("request!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			username = data.username;
//			collision  = data.collistion;
			x = data.location_x;
			y = data.location_y;
			planet.find().toArray(function(err, results){

				if(err){
					console.log("Planet Find Error : ");
					console.log(err);
				} else if(results){
					for(var i =0; i< results.length; i++){
						if((((results[i].location_x <= x) && (results[i].location_x >= (x-100))) || ((results[i].location_x >= (x+64-100)) && (results[i].location_x <= x+64)) ) && (((results[i].location_y <= y) && (results[i].location_y >= (y -100))) || ((results[i].location_y >= (y+64-100)) && (results[i].location_y <= (y+64)))   )   ){
							//collision
							
							mem_plan.findOne({p_id: results[i].p_id}, function(err, mem_plan_dev){
								if(err){
								
								} else if(mem_plan_dev){
									develop = mem_plan_dev.develop;
									console.log(develop);

								} else{
								
								}
							});
							getP = results[i];
							getP.collision=1;
							getP.username=username;
							getP.develop=develop;
							console.log(getP);
							break;
						}
						else{
							getP = {"p_id" : null, "mineral":null, "gas":null, "unknown":null, "location_x" : null, "location_y" : null, "create_spd": null, "develop":null, "username":username, "collision":0}
						}
					}

				} else{
				
				}

			});
			
			socket.emit('collision_res',  getP);

	
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
