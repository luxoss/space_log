var MongoClient = require('mongodb').MongoClient;

var username, u_mineral, u_gas, u_unknown, u_exp;
var p_id, p_mineral, p_gas, p_unknown, p_exp;
var q=10;
//var overf = 0;	
function chngUserRscPlntRsc(){
	MongoClient.connect("Mongodb://localhost:27017/space_log", function(err,db){
//	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
//		console.log(".././.s/././/./..s/d.f/./.f");		
		if(err){
			console.log('mongo client connection error !');
			console.log(err);
		}

		var planet = db.collection('PLANET');
	//	var mem_plan = db.collection('MEM_PLAN');
		var mem_info = db.collection('MEM_INFO');

	//	var m_p_cursor = mem_plan.find();


//		m_p_cursor.each(function(err, MPC){
		planet.find().each(function(err,MPC){
			if(err){
			
			} else if(MPC){
				if(MPC.develop == "true"){
					p_mineral = MPC.mineral -q;
					p_gas = MPC.gas -q;
					p_unknown = MPC.unknown -q;

					if(p_mineral < 0){
						p_mineral =0;
					}
					if(p_gas < 0){
						p_gas =0;
					}
					if(p_unknown < 0){
						p_unknown = 0;
					}
					planet.update({p_id : MPC.p_id}, {$set : { mineral : p_mineral, gas : p_gas, unknown : p_unknown}});
					


					mem_info.findOne({username : MPC.username}, function(err, MIres){
					
								u_mineral =MIres.mineral +q;
								u_gas = MIres.gas +q;
								u_unknown = MIres.unknown +q;
								//u_exp = MIres.exp + q;
								var obj = {
									mineral : u_mineral,
									gas: u_gas,
									unknown : u_unknown,
								//	exp : u_exp
								}
								mem_info.update({username: MPC.username}, {$set : obj});
							});	
					/*
				//	console.log(MPC.p_id);
					planet.findOne({p_id : MPC.p_id}, function(err, Pres){
						p_mineral = Pres.mineral - q;
						p_gas = Pres.gas - q;
						p_unknown = Pres.unknown - q;
						if(p_mineral < 0 || p_gas < 0 || p_unknown < 0){
							p_mineral =0;
							p_gas =0;
							p_unknown = 0;
							
						} else{
							planet.update({p_id : MPC.p_id}, {$set:{
								mineral : p_mineral,
								gas : p_gas,
								unknown : p_unknown
							}});


							mem_info.findOne({username : MPC.username}, function(err, MIres){
					
								u_mineral =MIres.mineral +q;
								u_gas = MIres.gas +q;
								u_unknown = MIres.unknown +q;
								u_exp = MIres.exp + q;
								var obj = {
									mineral : u_mineral,
									gas: u_gas,
									unknown : u_unknown,
								exp : u_exp
								}
								mem_info.update({username: MPC.username}, {$set : obj});
							});	


						}
					});*/
/*					
					mem_info.findOne({username : MPC.username}, function(err, MIres){
					
						u_mineral =MIres.mineral +q;
						u_gas = MIres.gas +q;
						u_unknown = MIres.unknown +q;
						u_exp = MIres.exp + q;
						var obj = {
							mineral : u_mineral,
							gas: u_gas,
							unknown : u_unknown,
							exp : u_exp
						}
						mem_info.update({username: MPC.username}, {$set : obj});
					});	*/
				}
				
			}
		});
	});

}

setInterval(chngUserRscPlntRsc, 300000);
//setInterval(chngUserRscPlntRsc, 600000); //10 minute

//});
