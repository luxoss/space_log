var express = require('express');
var app = express();
var router = express.Router();

var username;
var g_mineral, g_gas, g_unknown;
var g_exp;
var s_mineral, s_gas, s_unknown;
var s_exp;

var MongoClient = require('mongodb').MongoClient;

var io = require('socket.io').listen(5003);

router.get('/', function(req, res, next){
	res.send('respond with a resource');
});

io.on('connection', function(socket){
	//user get resource -> change the user's informations
	socket.on('get_rsrc', function(data){
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
				
				}

			});
			
		});


		
	});

	//user get exp
	socket.on('get_exp', function(data){
		username = data.username;
		g_exp = data.exp;

		// s_epx = mongoClinet.collection("PLANET").exp + g_exp
		s_exp = 
	
	});

});





console.log('changeUserInform.js : https://203.237.179.21:5003');
