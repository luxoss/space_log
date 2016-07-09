var io = require('socket.io').listen(5002);
var MongoClient = require('mongodb').MongoClient;

io.on('connection', function(socket){
			
	socket.on('planet_req', function(data){
		console.log("I get a planet request.");
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			var collection = db.collection("PLANET");
			collection.find().toArray(function(err, Pdocs){
				if(err){
					console.log('Finding to array documents is error');
					console.log(err);
				} else{
					console.log('Planet doucment is.....');
					for(var i=0; i< Pdocs.length; i++){
						console.log(Pdocs[i]._id);

						socket.emit('planet_res', Pdocs[i]);
						//socket.emit('planet_res', {_id : Pdocs[i]._id, mineral : Pdocs[i].mineral, gas : Pdocs[i].gas , unknown : Pdocs[i].unknown, location_x : Pdocs[i].location_x, location_y : Pdocs[i].location_y, create_spd : Pdocs[i].create_spd});
					}
				}

			});		
		});
	});


});

console.log('sendPlanet.js : ttp://203.237.179.21:5002');
