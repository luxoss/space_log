var MongoClient = require('mongodb').MongoClient;
var io =require('socket.io').listen(5002);

var new_p_n;
var level_p=5;
var source_q, x, y, spd;
var data, get_time;


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

				date = new Date();
				get_time = date.getTime();	
				console.log('get Time : ' + get_time);
				var t = get_time%10;
				source_q = (100 + t)*(t%level_p);
				x = (t+level_p*100)*(t%level_p)+t;
				y = (t+level_p)*(100-t)-level_p;
				spd = t%level_p;
				collection.insert({mineral : source_q, gas : source_q, unknown : source_q, location_x : x, location_y : y , create_spd : spd}, function(err, ins_res){});

				io.on('connection', function(socket){
					socket.on('planet_req', function(data){//when client request the all of planet data.
						var planet = collection.find(function(err, planet){
							if(err){
							
							} else{
								console.log('planet');
								console.log(planet);
								//socket.emit('planet_req', planet);
							}	
						});
					});


				});
			}
		});
	}); 		
	
}

setInterval(create_p, 86400000);//10초단위로 create_p 함수를 실행
