var MongoClient = require('mongodb').MongoClient;

var new_p_n;
var level_p=5;
var source_q=0, x=0, y=0, spd=0;
var date, get_time;
var cnt;

function create_p(){
//DB에 행성 정보를 저장하는 걸 여기에 넣기
	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
		
		var collection = db.collection("PLANET");

		var mem_info = db.collection("MEM_INFO");

		mem_info.find().each(function(err, miRes){
			if(miRes){
				mem_info.update({username : miRes.username}, {$set:{ticket:10}});
			}
		});



	//	var mem_plan = db.collection("MEM_PLAN");
		collection.count(function(err, count){
			if(err){

			} else{
				date = new Date();
				get_time = date.getTime();	
			
				var ran = parseInt(Math.random() % 999) + 1;
				var t = get_time%999 + 1;
				source_q = (100 + t)*(t%level_p +1);
				//x = (t+level_p*100)*(t%level_p +1)+(t+ran);
				//y = (t+level_p)*(100-t)-(level_p-ran);
				spd = t%level_p;
				
				x = Math.floor(Math.random()*5000-105);
				y = Math.floor(Math.random()*5000-105);
				
				collection.find().count(function(err, count){
					cnt = count+1;
				});

				collection.findOne({location_x : x, location_y : y},  function(err, doc){
					if(err){
					
					} else if (doc == null){
						console.log('There are no planetn\'s location x, y. So insert the documents');
						collection.insert({p_id : cnt, mineral : source_q, gas :source_q, unknown : source_q, location_x : x, location_y : y, create_spd : spd, develop:"false", username: ""}, function(err, ins_res){});
						
					//	mem_plan.insert({p_id : cnt, develop:"false", username :""});
					} else{ 
						console.log('there are already data');
						var n_dat = new Date();
						var n_get_time = date.getTime();
						var n_ran = parseInt(Math.random() %10) +1;
						var n_t = n_get_time%10 +1;
						source_q = source_q + (n_t*n_ran);
						x = x + (n_t*n_ran);
						y = y + (n_t*n_ran);
						spd = n_t%level_p;
//						cnt = collection.find().count();
//						console.log("!^@#&(#*(#**$($*    cnt :::::   !*#*($#*Q@&*&#*#&$(*&    " + cnt);

						collection.findOne({location_x : x, location_y : y},  function(err, rdoc){
							if(err){
							
							}else if(rdoc == null){
								collection.insert({p_id : cnt, mineral : source_q, gas : source_q, unknown : source_q, location_x : x, location_y : y, create_spd : spd, develop:"false", username:""});
							//	mem_plan.insert({p_id : cnt, develop:"false", username:""});
							}
						});
					}
				});
			}
		});
	}); 		
}

setInterval(create_p, 21600000);//10초단위로 create_p 함수를 실행
//setInterval(create_p, 500);//10초단위로 create_p 함수를 실행

