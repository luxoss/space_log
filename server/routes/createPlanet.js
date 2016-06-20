var MongoClient = require('mongodb').MongoClient;

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
			//	console.log('count : ' + count);

				date = new Date();
				get_time = date.getTime();	
				console.log('get Time : ' + get_time);

				var ran = parseInt(Math.random() % 10) + 1;
				var t = get_time%10 + 1;
				source_q = (100 + t)*(t%level_p +1);
				x = (t+level_p*100)*(t%level_p +1)+(t+ran);
				y = (t+level_p)*(100-t)-(level_p-ran);
				spd = t%level_p;

				
				collection.findOne({location_x : x, location_y : y},  function(err, doc){
					if(err){
					
					} else if (doc == null){
						console.log('There are no planet\ns location x, y. So insert the documents');
						collection.insert({mineral : source_q, gas :source_q, unknown : source_q, location_x : x, location_y : y, create_spd : spd}, function(err, ins_res){});
					} else{ 
						console.log('there are already data');
					}
				});

				//collection.insert({mineral : source_q, gas : source_q, unknown : source_q, location_x : x, location_y : y , create_spd : spd}, function(err, ins_res){});
			}
		});
	}); 		
	
}

//setInterval(create_p, 86400000);//10초단위로 create_p 함수를 실행

setInterval(create_p, 300);//10초단위로 create_p 함수를 실행

//onsole.log('createPlanet.js : http://203.237.179.21:5002');

