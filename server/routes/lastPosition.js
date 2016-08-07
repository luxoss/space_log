/*

var io = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var username, x , y;


io.on('connection', function(socket){
	socket.on('lpos_req', function(data){
		console.log('I get a request saving user\'s last position');
		MongoClient.connect("mongodb://localhost/space_log",function(err, db){
			var collecction = db.collection("MEM_INFO");
			username = data.username;
			x = data.x;
			y = data.y;

			collection.update({username : username}, {$set : {location_x : x, location_y : y}}, function(err, Pdocs){
				if(err){
					console.log(err);				
				} else if(Pdocs != null){
					
				}
			
			
			});
			
		});
	
	});
});

console.log('lastPosition.js : http://203.237.179.21:5003');

*/
