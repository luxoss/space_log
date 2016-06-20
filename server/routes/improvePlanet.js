var MongoClient = require('mongodb').MongoClient;

var level_p = 5;

function improve_p(){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var collection = db.collection("PLANET");

		collection.find().toArray(function(err, planet){
			if(err){
				console.log('There is no planet document');
			} else{
				//console.log('Improve planet js file');
				for(var i =0; i<planet.length; i++){
					switch(planet.create_spd){
					case 0:

						break;

					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
					case 4:
					 	break;
					default:
					
					}
				
				}
			}
		});
	});	
}

setInterval(improve_p, 1000);
