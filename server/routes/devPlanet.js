var devPlntio = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var planet, mem_info, mem_plan;

var p_id, username;
var r_id;
devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		console.log('add_p MESSAGE');
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			mem_plan = db.collection("MEM_PLAN");
			
			p_id = data.p_id;
			username = data.username;
			console.log(p_id);
			var findByPid = {"p_id" : p_id};
			mem_plan.findOne(findByPid, function(err, f_res){
				if(err){
					console.log('MEM_PLAN FindOne query error :::');
					console.log(err);
				} else if(f_res){
					if(f_res.develop == "false"){
						console.log('MEM_PLAN document develop field value : false');
						mem_plan.update({"p_id":p_id}, {$set: {"develop" : "true", "username":username}}, function(err, r){
							if(err){
								console.log('///////////');
								console.log(err);
								socket.emit('chng_plan', r);//p_id, username, develop
							}
						});
					}
				}

			});
			mem_info.findOne({username:username}, function(err,res){
				if(res){
					console.log('CHNG_INFO');
					console.log(res);
					socket.emit('chng_info', res);
				}
			});

			/*
			mem_plan.findOne({"p_id" : p_id}, function(err, result){
				console.log("MEM_PLAN find query");
				if(err){
					console.log(err);
				} else if (result){
					console.log('result!');
					if(result.develop == "false"){
						console.log('result.develop : false');
						console.log(p_id);
						mem_plan.findOne({p_id:p_id},  function(err,res_id){
							if(err){
								console.log(err);
							//	console.log('/////////////////');

							} else if(res_id){
								if(p_id == res_id.p_id){
									console.log('/////');
									mem_plan.update({"p_id":p_id}, {$set:{"develop":"true"}}, function(err, x){
										if(err){
											console.log("WHY!!!!!!!!!!!!");
											console.log(err);
										}
									});	
								}
							}

						});
						
						
						devPlntio.emit('add_p_result', {"p_id":p_id, "username":username, "develop":"true"});
					} else if (result.develop == "true"){
						console.log("resulte.develop : true");	
					} else {
						console.log("PLANET Collection's [develop] field value is not true or false. Please check the value");
					}	
				} else{
					
				}
			});*/
			
		});
	});
/*	socket.on('rmv_p', function(data){
	
	});*/

});


console.log("devPlanet.js : https://203.237.179.21:5003");
