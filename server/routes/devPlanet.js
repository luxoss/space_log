var devPlntio = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var planet, mem_info, mem_plan;

var p_id, username;
var r_id;
var add_score=0;
var crt_spd;

var arrMP = [];
var i=0;

var sum_score =0;

devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		console.log('add_p MESSAGE');
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
		//	mem_plan = db.collection("MEM_PLAN");
			
			p_id = data.p_id;
			username = data.username;
			console.log(p_id);


			planet.find().each(function(err, mpRes){
				if(mpRes){
					arrMP[i++] = mpRes;
				}
			
			});

			for(var z =0; z<arrMP.length; z++){
				console.log(z);
				if(arrMP[z].develop == "false"){
					console.log("Planet's develop is FALSE!!!");
					planet.update({p_id : p_id}, {$set : {develop : "true", username: username}}, function(err, res){
						if(err){
							console.log("ERRROROROROROOR!!!!    " + err);
						} else if(res){
							console.log("SUCCESS!!!!!!!");
							mem_info.findOne({username:username}, function(err, findRes){
								if(findRes){
									console.log("devPlanet.js ::: find Memebr in mem_info collection");
									sum_socre = findRes + arrMP[z].create_spd;
									console.log('::::::::::::::::::::::sum_score ::: ' + sum_score);
									mem_info.update({username : username}, {score : sum_score});
								}
							});

							//Not Complete!
						
						}

					});
				}
			}
			

		


			/*
		//	var findByPid = {"p_id" : p_id};
			mem_plan.findOne({p_id : p_id}, ifunction(err, f_res){
				if(err){
					console.log('MEM_PLAN FindOne query error :::');
					console.log(err);
				} else if(f_res){
					console.log('MEM_PLAN.FINDONE ::: ');
					if(f_res.develop == "false"){
						console.log('MEM_PLAN document develop field value : false');
						mem_plan.update({"p_id":p_id}, {$set: {"develop" : "true", "username":username}}, function(err, r){
							if(err){
								console.log('///////////');
								console.log(err);
						
							} else if(r){
								crt_spd = r.create_spd;
								console.log("!!!!!!!!!!!!!!!!!!!!!!" +crt_spd);
								mem_info.findOne({username, username}, function(err, mires){
									if(mires){
										console.log('devPlanet.js file ::: mires ::::');
										console.log('r.create_spd :::: ' + crt_spd);i
										sum_score = mires.score + crt_spd;
										console.log('||||mires.score ::: ' + mires.score + "  |||||| sum_score ::: " + sum_score);
										mem_info.update({username:username}, {$set:{score: sum_score}});
									}
								});
							//	mem_info.update({username:username}, {$set : {score:}});
								socket.emit('chng_plan', r);//p_id, username, develop
							}
							
						});
					}
				}

			});*/
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
