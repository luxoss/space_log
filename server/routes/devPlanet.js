//module : send mail
var nodemailer = require('nodemailer');


var devPlntio = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var planet, mem_info, member;

var p_id, username;
var r_id;
var add_score=0;
var crt_spd;

var arrMP = [], arrMI = [];
var i=0, j=0, z=0;

var sum_score, ticket;

devPlntio.on('connection', function(socket){
	socket.on('bet_add_p',  function(data){
		console.log("[devPlanet.js] bet_add_p message");
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			member = db.collection("MEMBER");
			p_id = data.p_id;
			username = data.username;
			number = data.choose_number;
			console.log("[devPlanet.js] p_id : " , p_id);
			console.log("[devPlanet.js] username : " , username);
			console.log("[devPlanet.js] number : ", number);
			planet.find().each(function(err, mpRes){
				if(mpRes == null){
					return ;
				}
				if(mpRes.p_id == p_id){
					console.log("[devPlanet.js] Planet's develop is TRUE !!");
					if(number < mpRes.number){
						console.log("[devPlanet.js] number is so small");
						mem_info.update({username : username}, {$inc : {mineral : -500 , gas : -500, unknown : -500}}, function(err, res){
							
							if(err){
									
							} else if (res){
								mem_info.findOne({username:username}, function(err, mem_find_res){
									socket.emit('bet_num', "fail");	
									socket.emit('chng_user', mem_find_res);
								});
									
							} 
						});
						mem_info.update({username : mpRes.username}, {$inc:{mineral : 500, gas : 500, unknown : 500}});
	
		
					} else if(number == mpRes.number){
						planet.update({p_id : p_id}, {$set : {username:"", develop:"false", number:0}});	
						mem_info.update({username : username}, {$inc: {mineral : -1000, gas : -1000, unknown : -1000}});
						mem_info.update({username : mpRes.username}, {$inc:{mineral : -1000, gas : -1000, unknown : -1000}});

						mem_info.findOne({username: username}, function(err, mem_find_res){
							if(mem_find_res){
								socket.emit('bet_num', "same");
								socket.emit('chng_user', mem_find_res);
							}
						});
					
						member.findOne({username:mpRes.username}, function(err, findMem){
							if(err){
								console.log("[devPlanet.js] Finding member is error");
							}else if(findMem){
								console.log("[devPlanet.js] Finding member is success. send the mail to member");
								var smtpTransport = nodemailer.createTransport("SMTP", {
									service : '',
									auth: {
										user : '',
										pass : ''
									}
								});
								var mailOptions={
									from : '관리자<@gmail.com>',
									to : findMem.email,
									subject:'행성의 소유권이 박탈 되었습니다 !',
									text : '당신이 보유한 행성 중 하나의 소유권이 박탈되었습니다. 현재 해당 행성은 그 어느 누구의 소유도 아닙니다. 지금 바로 접속 하셔서 다시 행성을 소유하세요!.\ngame.smuc.ac.kr'
								};
								smtpTransport.sendMail(mailOptions, function(err, response){
									if(err){
										console.log('[devPlanet.js] : error');
										console.log(err);
									} else if(response){
										console.log("[devPlanet.js] : Message send : " + response.message);
									}
									smtpTransport.close();
								});
							}

						



						});



	
					} else if(number > mpRes.number){
						console.log("[devPlanet.js] number is so big");
						planet.update({p_id : p_id}, {$set : {username: username, number:number}});
						mem_info.findOne({username:username}, function(err, mem_find_res){
							socket.emit('bet_num', "success");
							socket.emit('chng_user', mem_find_res);
						});
						member.findOne({username:mpRes.username}, function(err, findMem){
							if(err){
								console.log("[devPlanet.js] Finding member is error");
							}else if(findMem){
								console.log("[devPlanet.js] Finding member is success. send the mail to member");
								var smtpTransport = nodemailer.createTransport("SMTP", {
									service : '',
									auth: {
										user : '',
										pass : ''
									}
								});
								var mailOptions={
									from : '관리자<@gmail.com>',
									to : findMem.email,
									subject:'행성을 빼앗겼습니다!',
									text : '당신이 보유한 행성 중 하나를 누군가에게 빼앗겼습니다. 지금 접속 해서 확인하세요.\ngame.smuc.ac.kr'
								};
								smtpTransport.sendMail(mailOptions, function(err, response){
									if(err){
										console.log('[devPlanet.js] : error');
										console.log(err);
									} else if(response){
										console.log("[devPlanet.js] : Message send : " + response.message);
									}
									smtpTransport.close();
								});
							}

						



						});
					/*						
						var smtpTransport = nodemailer.createTransport("SMTP", {
							service : 'Gmail',
							auth: {
								user : 'ujuin93',
								pass : 'dnwnwjdqhr159753'
							}
						});
						var mailOptions={
							from : '관리자<ujuin93@gmail.com>',
							to : 'kapoochino93@gmail.com',
							subject:'Node js mail 테스트',
							text : '테스트다'
						};
						smtpTransport.sendMail(mailOptions, function(err, response){
							if(err){
								console.log('[devPlanet.js] : error');
								console.log(err);
							} else if(response){
								console.log("[devPlanet.js] : Message send : " + response.message);
							}
							smtpTransport.close();
						});
					*/
					}

					/*	mem_info.findOne({username:username}, function(err, mem_find_res){
							socket.emit('chng_plan', mem_find_res);	
						});*/
	
				}
			});


		});
	});

	socket.on('add_p', function(data){
		console.log('add_p MESSAGE');
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			console.log('[devPlanet.js] : ' + data.p_id);
			console.log('[devPlanet.js] : ' + data.username);
			console.log('[devPlanet.js] : ' + data.choose_number);		
		
			p_id = data.p_id;
			username = data.username;
			number = data.choose_number;

			planet.find().each(function(err, mpRes){
		//		console.log("[devPlanet.js] mpRes Objects ::: ");
		//		console.log(mpRes);
				if(mpRes == null){
					return ;
				}
				if(mpRes.p_id == p_id){
					//if(mpRes.develop == "false"){
						console.log("{devPlanet.js} Planet's develop is FALSE !!");
						planet.update({p_id : p_id}, {$set : {develop : "true", username : username, number : number}}, function(err, res){
							if(err){
								console.log("[devPlanet.js] Plnaet collection update(develop: false -> true) is failed" + err);
							} else if (res){
								console.log("[devPlanet.js] Planet's update is SUCCESS !");
								mem_info.update({username:username}, {$inc:{score : +1, ticket:-1}}, function(err, update_res){
								if(err){
									console.log("[devPlanet.js] mem_info collection update is failed" + err);
									} else if(update_res){
										console.log("[devPlanet.js] mem_info collection update is success\n" + update_res) ;
							//			socket.emit('add_p_res_userinfo', update_res);
										mem_info.findOne({username:username}, function(err, findRes){
											if(findRes){
												console.log("[devPlanet.js] send the result to client what Server process the data");
												socket.emit('add_p_res_userinfo', findRes);

											}
										});

									}
								});
								socket.emit('chng_plan', res);
							}
						});
				//	} 
				/*	if(mpRes.develop == "true"){
						console.log("[devPlanet.js] Planet's develop is TRUE !!");
						if(number < mpRes.number){i
							console.log("[devPlanet.js] number is so small");
							mem_info.update({username : username}, {$inc : {mineral : -100 , gas : -100, unknown : -100}}, function(err, res){
							
								if(err){
								
								} else if (res){
									mem_info.findOne({username:username}, function(err, mem_find_res){
										socket.emit('bet_num', "fail");	
										socket.emit('chng_user', mem_find_res);
									});
								
								} 
							});
							mem_info.update({username : arrMP[z].usernmae}, {$inc:{mineral : 100, gas : 100, unknown : 100}});
	
		
						} else if(number == mpRes.number){
							planet.update({p_id : p_id}, {$set : {username:"", develop:"false", number:0}});	
							mem_info.update({username: username}, function(err, mem_find_res){
								if(mem_find_res){
									socket.emit('bet_num');
								}
							});
	
						} else if(number > mpRes.number){
							console.log("[devPlanet.js] number is so big");
							planet.update({p_id : p_id}, {$set : {username: username, number:number}});
							mem_info.findOne({username:username}, function(err, mem_find_res){
								socket.emit('bet_num', "success");
								socket.emit('chng_user', mem_find_res);
							});	
							var smtpTransport = nodemailer.createTransport("SMTP", {
								service : 'Daum',
								auth: {
									user : 'ujuin13',
									pass : 'dnwnwjdqhr13'
								}
							});
							var mailOptions={
								from : '관리자<ujuin13@daum.net>',
								to : 'kapoochino93@gmail.com',
								subject:'Node js mail 테스트',
								text : '테스트다'
							};
							smtpTransport.sendMail(mailOptions, function(err, response){
								if(err){
									console.log('[devPlanet.js] : error');
								} else{
									console.log("[devPlanet.js] : Message send : " + response.message);
								}
								smtpTransport.close();
							});

					
						}

						mem_info.findOne({username:username}, function(err, mem_find_res){
							socket.emit('chng_plan', mem_find_res);	
						});

					}*/
				}
			});
				
			mem_info.findOne({username:username}, function(err,res){
				if(res){
				//	console.log('CHNG_INFO');
				//	console.log(res);
					socket.emit('chng_info', res);
				}
			});
		

			
		});
	});


});


/*
devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		console.log('add_p MESSAGE');
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			console.log('[devPlanet.js] : ' + data.p_id);
			console.log('[devPlanet.js] : ' + data.username);
			console.log('[devPlanet.js] : ' + data.choose_number);		
		
			p_id = data.p_id;
			username = data.username;
			number = data.choose_number;

			console.log("CHECK the p_id value in add_p message !!|||!|!|!|!|!|!|" + p_id);;


			planet.find().each(function(err, mpRes){
				if(mpRes){
					arrMP[i++] = mpRes;
				}
			console.log("arrMP's length : " + arrMP.length);

			});
			mem_info.find().each(function(err, miRes){
				if(miRes){
					arrMI[j++] = miRes;
				}
			});
			console.log("arrMP's length : " + arrMP.length);

			while(z<arrMP.length){
				console.log("[devPlanet.js] : count z " + z);


				z++;
			}


			
			for(z=0; z<arrMP.length; z++){
				console.log("/////////////" +z);
				if(arrMP[z].develop == "false" && arrMP[z].p_id == p_id){
			
					console.log("[devPlanet.js] Planet's develop is FALSE!!!");
					planet.update({p_id : p_id}, {$set : {develop : "true", username : username, number : number}}, function(err, res){
						if(err){
							console.log("ERRROROROROROOR!!!!    " + err);
						} else if(res){
							console.log("SUCCESS!!!!!!!");
							//sum_score = res.create_spd + 	
							
							mem_info.findOne({username:username }, function(err, findRes){
								if(findRes){
									console.log("[devPlanet.js] ::: find Memebr in mem_info collection       !!!!!!!   " + arrMP[z].create_spd);
									
									sum_score = parseInt(findRes.score) +  parseInt(arrMP[z].create_spd, 10) +1;
									ticket = parseInt(findRes.ticket , 10);
													
									mem_info.update({username : username}, {$set :{score : sum_score +1, ticket : ticket - 1}}, function(err, updt){
										if(updt){
											console.log('[devPlanet.js] : add_p_res_userinfo data');
										//	console.log(updt);
											mem_info.findOne({username:username},function(err, res){
												console.log(res);
												socket.emit('add_p_res_userinfo', res);
											} );
										}
									});
								//		socket.emit('add_p_res_userinfo', );
							
								  } else{
								  //	socket.emit('');
								  }

							});	
							socket.emit('chng_plan', res);
						}
					});
					break;
				} else if(arrMP[z].develop == "true" && arrMP[z].p_id == p_id){
					console.log("[devPlanet.js] Planet's develop is TRUE!");
					if(number < arrMP[z].number){
						mem_info.update({username : username}, {$inc : {mineral : -100 , gas : -100, unknown : -100}});
						mem_info.update({username : arrMP[z].usernmae}, {$inc:{mineral : 100, gas : 100, unknown : 100}});
					
					} else if (number == arrMP[z].number){
						planet.update({p_id : p_id}, {$set : {username:"", develop:"false", number:0}});	
					} else if (number > arrMP[z].number){
						planet.update({p_id : p_id}, {$set : {username: username, number:number}});
						var smtpTransport = nodemailer.createTransport("SMTP", {
							service : 'Daum',
							auth: {
								user : 'ujuin13',
								pass : 'dnwnwjdqhr13'
							}
						});
						var mailOptions={
							from : '관리자<ujuin13@daum.net>',
							to : 'kapoochino93@gmail.com',
							subject:'Node js mail 테스트',
							text : '테스트다'
						};
						smtpTransport.sendMail(mailOptions, function(err, response){
							if(err){
								console.log('[devPlanet.js] : error');
							} else{
								console.log("[devPlanet.js] : Message send : " + response.message);
							}
							smtpTransport.close();
						});
					}
				}
			}
			
			mem_info.findOne({username:username}, function(err,res){
				if(res){
					console.log('CHNG_INFO');
					console.log(res);
					socket.emit('chng_info', res);
				}
			});
		

			
		});
	});


});*/


console.log("devPlanet.js : https://203.237.179.21:5003");
