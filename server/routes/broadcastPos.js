
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

var collision =0;


var i=0, MIarr = [], arrP =[];

UsersPio.on('connection', function(socket){
	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
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
	//		console.log("request!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			username = data.username;
//			collision  = data.collistion;
			x = data.location_x;
			y = data.location_y;

			planet.find().each(function(err, result){
				if(result){
					arrP[i++] = result;
				}
			});
			

			for(var a=0; a< arrP.length; a++){
				console.log(arrP[a].p_id);

	if((((arrP[a].location_x <= x) && (arrP[a].location_x >= (x-100))) || ((arrP[a].location_x >= (x+64-100)) && (arrP[a].location_x <= x+64)) ) && (((arrP[a].location_y <= y) && (arrP[a].location_y >= (y -100))) || ((arrP[a].location_y >= (y+64-100)) && (arrP[a].location_y <= (y+64)))   )   ){
			/*	if(
					(((arrP[a].location_x <= x ) && (arrP[a].location_x >= (x - 100))
						|| ((arrP[a].location_x <= (x+64-100)) && (arrP[a].location_x <= x + 64))    )
							&& (((arrP[a].location_y <= y) && (arrP[a].location_y >= (y-100))) 
								|| (arrP[a].location_y >= (y+64-100)) && (arrP[a].location_y <= (y+64))))
					
				){*/
				//	console.log('collision!' + a);
					
					//arrP[a].username = username;

					arrP[a].collision = 1;
					collision = 1;
					planet.findOne({p_id:arrP[a].p_id}, function(err, res){
				//		res.collision = collision;
						var sendRes = {
							p_id 		: res.p_id,
							mineral 	: res.mineral,
							gas 		: res.gas,
							unknown 	: res.unknown,
							location_x 	: res.location_x, 
							location_y 	: res.location_y,
							develop	 	: res.develop,
							username 	: res.username,
							collision 	: collision
						}
						console.log('COLLISION !!//////////////////// ' + res.collision);
					//	socket.emit('collision_res', res);
						socket.emit('collision_res', sendRes);
					});
				//	socket.emit('collision_res', arrP[a]);
					break;

				//	console.log(arrP[a]);
				} else{
					collision = 0;
					arrP[a].username = username;
					arrP[a].collision =0;

				}
			//	socket.emit('collision_res', arrP[a]);

			}
			


/*
			planet.find().toArray(function(err, results){
//			var getP = {};

				if(err){
					console.log("Planet Find Error : ");
					console.log(err);
				} else if(results){
					for(var i =0; i< results.length; i++){

console.log("!!!!!!!!!!!CRUSH!!!!!!!!!!!!!!!!!!!!!!!!! " + results[i].location_x);
						if((((results[i].location_x <= x) && (results[i].location_x >= (x-100))) || ((results[i].location_x >= (x+64-100)) && (results[i].location_x <= x+64)) ) && (((results[i].location_y <= y) && (results[i].location_y >= (y -100))) || ((results[i].location_y >= (y+64-100)) && (results[i].location_y <= (y+64)))   )   ){
							//collision
							console.log('collision!');
											
							getP = results[i];						
							planet.findOne({p_id: results[i].p_id}, function(err, mem_plan_dev){
								if(err){
								
								} else if(mem_plan_dev){
									develop = mem_plan_dev.develop;
								//	console.log("DEVELOP dksjfalsdjflkajsdkfljaskldjfk");
									console.log(develop);
									getP.develop = develop;
									getP.username = username;
									getP.collision = 1;
								//	console.log(getP);	
										
									socket.emit('collision_res',  getP);
									

								} else{
								
								}
							});

						//	getP.collision=1;
						//	getP.username=username;
						//	getP.develop=develop;
						//	console.log(getP);
							break;
						}
						else{
							getP = {"p_id" : null, "mineral":null, "gas":null, "unknown":null, "location_x" : null, "location_y" : null, "create_spd": null, "develop":null, "username":username, "collision":0};
					//		console.log(getP);


						}
					}

				} else{
				
				}

			});*/
			
		//	socket.emit('collision_res',  getP);

	
		});
	

		member.find({accessing:"true"}).each(function(err, m_res){
			if(err){
				console.log(err);
			} else if(m_res){
				//socket.emit('login_all', {username});
				
				console.log(m_res.username);
				mem_info.findOne({username:m_res.username}, function(err, miRes){
					socket.emit('login_all', {username:miRes.username, location_x:miRes.location_x, location_y : miRes.location_y});
				//	MIarr[i++] = miRes;
				//	console.log(MIarr[i]);
				});
			//	MIarr[i++] = m_res;
			//	console.log(m_res);
			//	socket.emit('login_all', m_res);
			}
		});
		i=0;
	/*	for(var z=0; z< MIarr.length;z++){
//			console.log(MIarr[z].username);
			socket.emit('login_all', MIarr[z]);
		}*/

//
/*
		socket.on('login_all', function(data){
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

console.log("broadcastPos.js : http://203.237.17i9.21:5006");
