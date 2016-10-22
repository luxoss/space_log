var MongoClient = require('mongodb').MongoClient;

var username, u_mineral, u_gas, u_unknown, u_exp;
var p_id, p_mineral, p_gas, p_unknown, p_exp;
var q=10;


function chngUserRscPlntRsc(){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
//		console.log(".././.s/././/./..s/d.f/./.f");		
//		var planet = db.collection("PLANET");
		var mem_plan = db.collection("MEM_PLAN");
		var mem_info = db.collection("MEM_INFO");

		mem_plan.find().toArray(function(err, p){
			if(err){
			console.log(err);	
			} else if(p){
				console.log("if P!");
				for(var i =0; i< p.length; i++){
					if(p[i].develop == "true"){
						username = p[i].username;
						p_id = p[i].p_id;
						mem_info.findOne({username: username}, function(err, result){
						//	console.log('././.../');		

							u_mineral = result.mineral + q;
							u_gas = result.gas + q;
							u_unknown = result.unknown + q;
							
							mem_info.update({username:username}, {$set:{mineral:u_mineral, gas:u_gas, unknown:u_unknown}},  function(err, res){
								
								if(err){
									console.log("mem_info Update is ERR /////////////");
									console.log(err);
								}else if(res){
							//		console.log(res);
									console.log('lkjsdflkjaskldjfklsjadjf;kljaksdjf');
								}

							});
						});
				/*		planet.findOne({p_id:p_id}, function(err, result){
							console.log(result.gas);
							p_mineral = result.mineral - q;
							p_gas = result.gas - q;
							p_unknown = result.unknown - q;
						//	console.log(p_gas);
							planet.update({p_id:p_id}, {$set:{mineral:p_mineral, gas:p_gas, unknown:p_unknown}}, function(err, res){
								if(err){
									console.log("ERR ???????///////////////////////////");
								}
								else if(res){
									console.log("/./.././/././.././");
								}
							});
						});*/
					}
				}
			} else{
			
			}
		});
	});

}

//setInterval(chngUserRscPlntRsc, 60000);
//setInterval(chngUserRscPlntRsc, 5000);
