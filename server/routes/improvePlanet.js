var MongoClient = require('mongodb').MongoClient;

var level_p = 5;
var improve_q;

function improve_p(){
	MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		var collection = db.collection("PLANET");

		collection.find().toArray(function(err, planet){
			if(err){
				console.log('There is no planet document');
			} else{
				console.log('Improve planet js file');
//				console.log('............................' + planet + '..................................')
				for(var i =0; i<planet.length; i++){
					improve_q = (planet[i].create_spd+1) * level_p *100;				

					
					collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral +improve_q, gas : planet[i].gas + improve_q, unknown : planet[i].unknown + improve_q}});

					/*
					switch(planet[i].create_spd){
					case 0:

						collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral +5, gas : planet[i].gas + 5, unknown : planet[i].unknown + 5}});
						break;

					case 1:
						
						collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral + 10, gas : planet[i].gas + 10, unknown : planet[i].unknown + 10}});
						break;
					case 2:
						collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral + 15, gas : planet[i].gas + 15, unknown : planet[i].unknown + 15}});
						break;
					case 3:
						collection.update({_id : planet[i]._id}, {$set : {mineral: planet[i].mineral + 20 , gas : planet[i].gas + 20, unknown : planet[i].unknown + 20}});
						break;
					case 4:
						collection.update({_id : planet[i]._id}, {$set : {mineral : planet[i].mineral + 25, gas : planet[i].gas + 25, unknown : planet[i].unknown + 25}});
					 	break;
					default:
					
					}
					*/
				}
			}
		});
	});	
}

setInterval(improve_p, 86400000);
