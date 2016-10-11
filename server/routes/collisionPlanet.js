var CollisionPio = require('socket.io').listen(5007);
var MongoClient = require('mongodb').MongoClient;

var my_name, my_x, my_y, my_key;


CollisionPio.on('connection', function(socket){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var planet = db.collection("PLANET");
		var mem_info = db.collection("MEM_INFO");
		socket.on('collision_req', function(data){
			console.log("++_+_++__+_+_++_++_+_  get Collision request!!!   _++_+__+_+" );
			my_name = data.username;
			my_x = data.location_x;
			my_y = data.location_y;
			my_key = data.key_val;

			
			/*
			planet.find().toArray(function(err, Pdocs){
				if (err){
					
				} else{
				
				}
			});
			*/
		});


	});

});

console.log("collisionPlanet.js : http://203.237.179.21:5007");
