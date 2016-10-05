var devPlntio = require('socket.io').listen(5003);
//var MongoClient = require('mongodb').MongoClient;

var getMongoClient = require('./loginForm');





devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			var member = db.collection("MEMBER");
			member.findone({"username" : "jasonhan93"}, function(err, findres){
				console.log("--=-=--===-=-=-=-===-= findres : ---=-=-=-=-=-=-=-=-=-");
				console.log(findres);
			});
		});
	});
	socket.on('rmv_p', function(data){
	
	});

});

console.log("devPlanet.js : https://203.237.179.21:5003");
