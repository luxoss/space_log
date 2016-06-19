var io = require('sockete.io').listen(5002);
var MongoClient = require('mongodb').MongoClient;

io.on('connect' , function(err, data){
	consile.log('sendPlanet.js');
	console.log(data);
	
	socket.on('p_info' , function(err){
	if(err){
		console.log('socket on is err');
		console.log(err);
	} err{
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			var collection = db.collection("PLANET");
			collection.find(function(err, planet){
				if(err){
					console.log("Finding all planet information is ERROR");
					console.log(err);
					socket.emit('planet_info', {response : 'false'});
				} else{
					console.log("Planet information is...");
					console.log(planet);
				}
			});
		});

		
	}

	
	
	});
});
