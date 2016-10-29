var rankio = require('socket.io').listen(5008);
var MongoClient = require('mongodb').MongoClient;

var expSort = [],  rankArr =[], arrMPcur =[];
var i=0, j=0;

function cal_ranking(){
	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
		var mem_info = db.collection("MEM_INFO");
		var planet = db.collection("PLANET");
	//	var mem_plan = db.collection("MEM_PLAN");
		
		var m_i_cursor = mem_info.find();
		var m_p_cursor = planet.find();
	/*
		m_p_cursor.each(function(err, res){
			if(res){
				arrMPcur[j++] = res;
			}
		});

		for(var a =0; a< arrMPcur.length; a++){
			
		})*/

		m_i_cursor.sort({"exp":-1}).toArray(function(err, sortRes){
			if(err){
				console.log('sort error!!!!!!!!');
				console.log(err);
			} else if(sortRes){

				expSort = sortRes;
	
			}
		});		
		
		for(var z=0; z<expSort.length; z++){
//			console.log(expSort[z].username);	
			mem_info.update({username:expSort[z].username}, {$set:{rank:z+1}}, function(err, updateRes){
	
			});
			
		}
	});	
}

setInterval(cal_ranking, 60000);
//setInterval(cal_ranking, 6000);



rankio.on('connection', function(socket){
	socket.on('rank_req', function(data){
		console.log('reank_req :::::::::::::::');
	//	console.log(expSort[0].username);
		MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
			var mem_info = db.collection("MEM_INFO");
			
			mem_info.find().sort({"rank":1}).toArray(function(err, rankRes){
				if(rankRes){
					rankArr = rankRes;
				}
			});			
			for(var k=0; k<rankArr.length; k++){
				socket.emit('rank_res', {username: rankArr[k].username, rank:rankArr[k].rank});
			}

		});		
	});
});


