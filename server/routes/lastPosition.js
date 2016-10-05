

var LastPio = require('socket.io').listen(5005);
var MongoClient = require('mongodb').MongoClient;
var username="", x=0 , y=0;


LastPio.on('connection', function(socket){
	socket.on('lpos', function(data){
		console.log('I get a request saving user\'s last position');
		username = data.username;
		x = data.lastPosX;
		y = data.lastPosY;

		MongoClient.connect("mongodb://localhost/space_log",function(err, db){
			var collection = db.collection("MEM_INFO");
		//	console.log("LASTPOSITION :: USERNAME" + username);
		//	console.log("!!!!!!!" + x + "!!!!!!!!!" + y +"!!!!");

			collection.update({"username" : username}, {$set : {"location_x" : x, "location_y" : y}}, function(err, Pdocs){
				if(err){
					console.log(err);				
				} else if(Pdocs != null){
					
				}
			});
			
		});
	
	});
});

console.log('lastPosition.js : http://203.237.179.21:5005');


