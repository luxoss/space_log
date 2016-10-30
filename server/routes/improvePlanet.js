var MongoClient = require('mongodb').MongoClient;

var level_p = 5;
var improve_q=0;

function improve_p(){
	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
		var collection = db.collection("PLANET");

		collection.find().toArray(function(err, planet){
			if(err){
				console.log('There is no planet document');
			} else{
				console.log('Improve planet js file');

				for(var i =0; i<planet.length; i++){
					improve_q = (planet[i].create_spd+1) *100;				
					collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral +improve_q, gas : planet[i].gas + improve_q, unknown : planet[i].unknown + improve_q}});

				}
			}
		});
	});	
}

setInterval(improve_p,  2400000);// 40 minute
