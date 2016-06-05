var MongoClient = require('mongodb').MongoClient;

var last_p_num=0;
var save_p_num=0;
function create_p(){
//DB에 행성 정보를 저장하는 걸 여기에 넣기
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var adminDB = db.admin();
		adminDB.listDatabases(function(err, databases){});

		var collection = db.collection("PLANET");
		last_p_num = collection.count();
		save_p_num = last_p_num + 1;
		var x = 10*last_p_num + save_p_num;
		var y = 15*save_p_num - last_p_num;

		console.log('collection.cout() result is...');
		console.log(last_p_num);
	
		/*
		if(save_p_num<10){

			collection.insert({planet_id : save_p_num, mineral : 1000, gas : 1000, unknown : 1000, location_x : x, location_y : y, create_spd : 1});

		} else if(save_p_num>=10 && save_p_num<100){

			collection.insert({planet_id : save_p_num, mineral : 1000, gas : 800, unknown : 1000, location_x : x, location_y : y, create_spd : 2});

		} else if(save_p_num>=100 && save_p_num<1000){
			
			collection.insert({planet_id : save_p_num, mineral : 1000, gas : 800, unknown : 800, location_x : x, location_y : y, create_spd : 3});
						
		} else if (save_p_num>=1000 && save_p_num>10000){
			
			collection.insert({planet_id : save_p_num, mineral : 800, gas : 800, unknown : 800, location_x : x, location_y : y, create_spd : 4});
			
			
		} else{
			
			collection.insert({planet_id : save_p_num, mineral : 600, gas : 600, unknown : 600, location_x : x, location_y : y , create_spd : 5}); 
			
		}
		*/
	}); 		
	
}

//setInterval(create_p, 10000);//1초단위로 create_p 함수를 실행
