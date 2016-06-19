var io = require('sockete.io').listen(5002);
var MongoClient = require('mongodb').MongoClient;


MongoClient.connect("mongod://localhost/space_log", function(err, db){
	var collectino = db.collection("PLANET");
	

	io.on('connection', function(socket){
		socekt.on('plnt_req', function(data){
			collection.find().toArray(function(err, Pdocs){
				if(err){
					console.log('Finding to array documents is error');
					console.log(err);
				} else{
					console.log('Planet doucment is.....');
					for(var i=0; i< Pdocs.length; i++){
						console.log(Pdocs[i]._id);
						socekt.emit('plnt_res', Pdocs[i]);
					}
				}

			});		
		});
	});


});


