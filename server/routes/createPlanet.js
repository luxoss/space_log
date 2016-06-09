var MongoClient = require('mongodb').MongoClient;
var io =require('socket.io').listen(5000);
//var last_p_num;
//var save_p_num;
var new_p_n;
var level_p=5;

var source_q, x, y, spd;

function create_p(){
//DB에 행성 정보를 저장하는 걸 여기에 넣기
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
	//	var adminDB = db.admin();
//		adminDB.listDatabases(function(err, databases){});

		var collection = db.collection("PLANET");

		collection.count(function(err, count){
			if(err){

			} else{
				console.log('count : ' + count);
			//	new_p_n = count+1;
				var i =0;
				i=count+1;
				source_q = (100+i)*(i%level_p);
				x = (i+level_p)*(i%level_p)+i;
				y = (i+11)%((i%level_p)+6)*i;
				spd = i%level_p;
				
				io.on('connection', function(socket){
					socket.on('planet_req', function(data){
						collection.find(function(err, planet){
							if(err){
							
							} else {
							
							}
						});
					});
					
				});
				var j=0;
				while(j<count){
				
				}
				/*
				var i=0;
				while(i<count){
									
					collection.findOne({planet_id : i}, function(err, fnd_p){
						if(err){
									
						} else{
							if(fnd_p != null){
									
							} else{
								new_p_n = i+1;
								console.log('new_p_n   ' + new_p_n);
								source_q = (100+i)*(i%5);
								x = (i+5)*(i%5)+i;
								y = (i+11)%((i%5)+6)*i;
								spd = i%level_p;								
								
							}
						}
					});	
					i++;
					
				}*/

				collection.insert({mineral : source_q, gas : source_q, unknown : source_q, location_x : x, location_y : y , create_spd : spd}, function(err, ins_res){});

			}
		});
	}); 		
	
}

setInterval(create_p, 86400000);//10초단위로 create_p 함수를 실행
