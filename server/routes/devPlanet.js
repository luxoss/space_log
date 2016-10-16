var devPlntio = require('socket.io').listen(5003);
var MongoClient = require('mongodb').MongoClient;
var planet, mem_info, mem_plan;

devPlntio.on('connection', function(socket){
	socket.on('add_p', function(data){
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			planet = db.collection("PLANET");
			mem_info = db.collection("MEM_INFO");
			mem_plan = db.collection("MEM_PLAN");


		});
	});
	socket.on('rmv_p', function(data){
	
	});

});

function dev_p(){

}

//setInterval(dev_p, 600000);

console.log("devPlanet.js : https://203.237.179.21:5003");
