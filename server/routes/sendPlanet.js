var io = require('socket.io').listen(5002);
var MongoClient = require('mongodb').MongoClient;

var s_p_id, s_mineral, s_gas, s_unknown, s_create_spd, s_develop;
var sendP = {};	
var arrP = [], arrMP = [];
var i = 0, j=0;
io.on('connection', function(socket){
			
	socket.on('planet_req', function(data){
		console.log("I get a planet request.");
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
		

			var planet = db.collection("PLANET");
			var mem_plan = db.collection("MEM_PLAN");

			var p_cursor = planet.find();
			

			p_cursor.each(function(err,p){
				if(p){
					arrP[i++] = p;
				//	console.log(arrP[i-1].p_id);
				//	return arrP;
				}
		//		return arrP;
			});

			var m_p_cursor = mem_plan.find();
			m_p_cursor.each(function(err,m_p){
				if(m_p){
			//		console.log("j ::: " +j);	
					arrMP[j++] = m_p;

				//	console.log("p_id :: " + m_p.p_id + "  develop ::   " + m_p.develop + "  user :: " + m_p.username + ".......");
				//	return arrMP;
				}
			//	return arrMP;
			});

			console.log('asdflaksdjfa     :::   ' + arrP.length);
			console.log('asdflaksdjfa     :::   ' + arrMP.length);
			for(var z=0; z<arrP.length; z++){
				//console.log(arrP[z]);
				arrP[z].develop = arrMP[z].develop;
		//		console.log(arrP[z]);
				socket.emit('planet_res', arrP[z]);
			}

			
		});
i=0; j=0;
	});



});

console.log('sendPlanet.js : ttp://203.237.179.21:5002');
