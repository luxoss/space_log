var MongoClient = require('mongodb').MongoClient;

var last_p_num;
var save_p_num;
function create_p(){
//DB에 행성 정보를 저장하는 걸 여기에 넣기
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var adminDB = db.admin();
		adminDB.listDatabases(function(err, databases){});

		var collection = db.collection("PLANET");
		/*
		var cnt = collection.find({planet_id : {$exists : true}}, function(err, fnd_res){
			if(err){

			} else if (fnd_res){
				console.log('find result is : ');	
				console.log(fnd_res);
			}			
			
		});
		console.log(cnt);
		*/
		/*	
		var i=0;
		while(i<10){
			collection.findOne({planet_id : i}, function(err, chck_p_n){
					
			});				
			
			
		}
		*/

		/*
		for(var i=0;i<100 ;i++){
			collection.findOne({planet_id : i}, function(err, chck_p_n){
				if(err){
					concole.log('err. find planet_id is error...TT');
				} else{
					if(chck_p_n == null){
						console.log('There is no data of matching Planet number. Save the new Planet information.');

						var x = 10*i + (i+1);
						var y = 15*(i+1) - i;
						
						if(i<10){ //best planet
							collection.insert({planet_id : i, mineral : 1000, gas : 1000, unknown : 1000, location_x : x, location_y : y, create_spd : 1});
							
						} else if(i>=10 && i<100){
							collection.insert({planet_id : i, mineral : 1000, gas : 800, unknown : 1000, location_x : x, location_y : y, create_spd : 2});
							
						} else if(i>=100 && i<1000){
							collection.insert({planet_id : i, mineral : 1000, gas : 800, unknown : 800, location_x : x, location_y : y, create_spd : 3});
							
						} else if(i>=1000 && i<10000){
							collection.insert({planet_id : i, mineral : 800, gas : 800, unknown : 800, location_x : x, location_y : y, create_spd : 4});
							
						} else{ //worst planet
							collection.insert({planet_id : i, mineral : 800, gas : 600, unknown : 800, location_x : x, location_y : y, create_spd : 5});
							
						}
					} else{
						console.log('The planet number is already exist.');
					}
					
				}	
			});	
		}
	*/
	}); 		
	
}

setInterval(create_p, 30000);//30초단위로 create_p 함수를 실행
