var MongoClient = require('mongodb').MongoClient;



function chngUserRscPlntRsc(){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
//		console.log(".././.s/././/./..s/d.f/./.f");		
		var planet = db.collection("PLANET");
		var mem_plan = db.collection("MEM_PLAN");
		var mem_info = db.collection("MEM_INFO");

		mem_plan.find().toArray(function(err, planet){
			if(err){
			
			} else if(planet){
				for(var i =0; i< planet.length; i++){
					if(planet[i].develop == "true"){
					
					}
				}
			} else{
			
			}
		});
	});

}

setInterval(chngUserRscPlntRsc, 60000);
//setInterval(chngUserRscPlntRsc, 1000);
