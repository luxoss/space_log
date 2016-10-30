var io = require('socket.io').listen(5002);
var MongoClient = require('mongodb').MongoClient;

var s_p_id, s_mineral, s_gas, s_unknown, s_create_spd, s_develop;
var sendP = {};	
var arrP = [], arrMP = [], re_arrMP = [];
var i = 0, j=0;
io.on('connection', function(socket){
			
	socket.on('planet_req', function(data){
		console.log("I get a planet request.");
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
		

			var planet = db.collection("PLANET");
		//	var mem_plan = db.collection("MEM_PLAN");

			var p_cursor = planet.find();
			

			p_cursor.each(function(err,p){
				if(p){
					arrP[i++] = p;
				
				}
			});
/*
			var m_p_cursor = mem_plan.find();
			m_p_cursor.each(function(err,m_p){
				if(m_p){
					arrMP[j++] = m_p;
				}
			});

			console.log('asdflaksdjfa     :::   ' + arrP.length);
			console.log('asdflaksdjfa     :::   ' + arrMP.length);*/
			for(var z=0; z<arrP.length; z++){

			//	arrP[z].develop = arrMP[z].develop;
				socket.emit('planet_res', arrP[z]);
			//	console.log("planet_res :::::     " + z);
			}
			
		});
i=0; j=0;

	//console.log('./././.' + arrMP[0].username);
	});
	socket.on('my_planet_req', function(data){
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			var planet = db.collection("PLANET");
		//	var mem_plan = db.collection("MEM_PLAN");

			
			
			/*
			mem_plan.find().each(function(err, m_p){
				if(m_p){
					re_arrMP[j++] = m_p;
				}
			});*/
			console.log('username :: ', data.username);
			planet.find({username: data.username}).each(function(err, resultP){
				if(resultP){
					re_arrMP[j++] = resultP;
				}
			});
			for(var z =0; z< re_arrMP.length; z++){
				socket.emit('my_planet_res', re_arrMP[z]);
				/*
				planet.findOne({p_id : re_arrMP[z].p_id}, function(err, result){
					if(result){
						socket.emit('my_planet.res', result);
					}
				});*/
			}

		});
	});



});

console.log('sendPlanet.js : ttp://203.237.179.21:5002');
