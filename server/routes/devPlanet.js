var devPlntio = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var planet, mem_info, mem_plan;

var p_id, username;

devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		console.log('add_p MESSAGE');
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			mem_plan = db.collection("MEM_PLAN");
			
			p_id = data.p_id;
			username = data.username;
			mem_plan.findOne({"p_id" : p_id}, function(err, result){
				console.log("MEM_PLAN find query");
				if(err){
					console.log(err);
				} else if (result){
					console.log('result!');
					if(result.develop == "false"){
						console.log('result.develop : false');
						console.log(p_id);
						mem_plan.update({"p_id" : p_id}, {$set : {"username":username, "develop" : "true"}}, function(err, updateR){
							if(err){
								console.log('planet update is err');
								console.log(err);
							} else if(updateR){
								console.log('planet update result is....');
								console.log(updateR);
							} else{
							
							}
						});
					//	result.develop="true";
					//	mem_plan.save({"p_id" : p_id, "username":username});
						devPlntio.emit('add_p_result', {"p_id":p_id, "username":username, "develop":"true"});
					} else if (result.develop == "true"){
						console.log("resulte.develop : true");	
					} else {
						console.log("PLANET Collection's [develop] field value is not true or false. Please check the value");
					}	
				} else{
					
				}
			});
			
		});
	});
/*	socket.on('rmv_p', function(data){
	
	});*/

});
/*
function dev_p(){
	
	


}
*/
//setInterval(dev_p, 600000);

console.log("devPlanet.js : https://203.237.179.21:5003");
