/*

var username;
var g_mineral, g_gas, g_unknown;
var g_exp;
var s_mineral, s_gas, s_unknown;
var s_exp;

var l_x, l_y;


var MongoClient = require('mongodb').MongoClient;

var io = require('socket.io').listen(5007);

io.on('connection', function(socket){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var mem_info = db.collection("MEM_INFO");
	//	var f_obj;
		//user get resource -> change the user's informations
		
		socket.on('lpos_req', function(data){

			console.log('lastposition req-------------');
			username = data.username;
			l_x = data.lastPosX;
			l_y = data.lastPosY;

			
			console.log('!!!!!!!!!!!!!!USERNAME ::: ' + username + '   LASTPOSITION_X :::  ' + l_x + '   LASTPOSITION_Y :::  ' + l_y + '!!!!!!!!!!!!!!!!!!');
			

			f_obj ={"username":username};

			collection.findOne(f_obj, function(err, user){
				if(err){
					console.log("changUserInform.js file's error: collection.findOne is error - socket(lpos_req");
					console.log("==================ERROR MESSAGE is=====================");
					console.log(err);
				} else if(user != null){
					collection.update(f_obj, {$set:{"location_x":l_x, "location_y":l_y}});
				} else if(user == null){
					console.log('There is no user: No matching username data in DB');
				}
			});
		});

		socket.on('uinfo_req', function(data){
			username = data.username;
			g_mineral = data.mineral;
			g_gas = data.gas;
			g_unknown = data.unknown;
			g_exp = data.exp
		//	collection = db.collection("MEM_INFO");
			
			f_obj = {"username":username};
			
			collection.findOne(f_obj, function(err, user){
				if(err){
					console.log("changeUserInform.js file's error : collection.findOne is error - socket(rsrc_req)");
					console.log("================ERROR MESSAGE is===========");
					console.log(err);

				} else if(user != null){
					s_mineral = user.mineral + g_mineral;
					s_gas = user.gas + g_gas;
					s_unknown = user.unknown + g_unknown;
					s_exp = user.exp + g_exp;

					collection.update(f_obj, {$set : {mineral:s_mineral, gas:s_gas, unknown:s_unknown, exp:s_exp}});
				
				} else if(user == null){
					console.log("There is no user: No matching username data in DB");
				}	
			});

		
		});

	
	});



	

});*/
/*
io.on('connection', function(socket){
	//user get resource -> change the user's informations
	socket.on('rsrc_req', function(data){
		username = data.username;
		//client must send to server the information of each resource that get quantity
		g_mineral = data.mineral;
		g_gas = data.gas;
		g_unknown = data.unknown;

		MongoClinet.connect("mongodb://localhost/space_log", function(err, db){
			var collection = db.collection("MEM_INFO");
			var f_obj = {"username" : username};

			collection.findOne(f_obj, function(err, user){
				if(err){
					console.log("ChangeUserInform.js file's error. There is no data that matching username");				
					console.log("=======ERROR MESSAGE======");
					console.log(err);
				} else if(user){
					s_mineral = user.mineral + g_mineral;
					s_gas = user.gas + g_gas;
					s_unknown = user.unknown + g_unknown;

					collection.update(f_obj, {$set : {mineral:s_mineral, gas:s_gas, unknown:s_unknown}});
				}

			});
			
		});
		
	});

	//user get exp
	socket.on('exp_req', function(data){
		username = data.username;
		g_exp = data.exp;
		
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			db.collection("MEM_INFO");		
			var f_obj = {"username" : username};

			collection.findOne(f_obj, function(err, user){
				if(err){
					console.log("changeUserInform.js file's error. There is no data that matching username");
					console.log("========ERROR MESSAGE========");
					console.lof(err);
				} else if(user){
					s_exp = user.exp + g_exp;
					collection.update(f_obj, {$set:{exp:s_exp}});
				}
				
			});
		
		});
	});
	
	//user last position
	socket.on('lpos_req', function(data){
		console.log('I get a requrest saving user\'s last position');
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			var collection = db.collection("MEM_INFO");
			username = data.username;
			x = data.x;
			y = data.y;

			var f_obj = {"username" : username};

			collection.update(f_obj, {$set : {location_x:x, location_y:y}}, function(err, Pdocs){
				if(err){
					console.log(err);
				} else if (Pdocs != null){
				
				}
			});
		});
	});

});
*/
//console.log('changeUserInform.js : https://203.237.179.21:5007');
