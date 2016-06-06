var MongoClient = require('mongodb').MongoClient;

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
					
				}

				collection.insert({planet_id : new_p_n, mineral : source_q, gas : source_q, unknown : source_q, location_x : x, location_y : y , create_spd : spd}, function(err, ins_res){
									
									
								});
//				collection.insert({planet_id : new_p_n, mineral : 1000, gas : 1000, unknown : 1000, location_x : 100, location_y : 100, create_spd : 1});
			}
		});
		
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
		var cnt =0;
		while(i<10){
			collection.findOne({planet_id : i}, function(err, chck_p_n){
				if(err){

				} else{
					if(chck_p_n != null){
						cnt = i;
						console.log(chck_p_n.planet_id);
					} else{
						
					
					}
				}
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

setInterval(create_p, 10000);//10초단위로 create_p 함수를 실행
