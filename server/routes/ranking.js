//var rankio = require('socket.io').listen(5008);
var MongoClient = require('mongodb').MongoClient;
/*
rankio.on('connection', function(socket){

});
*/

var expSort = [];
var i=0;

function cal_ranking(){
	MongoClient.connect("mongodb://localhost:27017/space_log", function(err, db){
		var mem_info = db.collection("MEM_INFO");
		var mem_plan = db.collection("MEM_PLAN");

		var m_i_cursor = mem_info.find();
		var m_p_cursor = mem_plan.find();
/*
		m_p_cursor.each(function(err,MPres){
			if(MPres){
			//	console.log('ranking.js');
				member[i++] = MPres;
			}	
		});

		for(var z=0; z<member.length;z++){
		//	console.log(member[z]);
		} */
/*
		m_i_cursor.each(function(err,res){
			if(res){
			//	console.log('ranking.js file :::: m_i_cursor.each query is success');
				member[i++] = res;
			}
		});

		for(var z =0; z<member.length; z++){
			console.log(member[z].username);
		}
*/		
		m_i_cursor.sort({"exp":-1}).toArray(function(err, sortRes){
			if(err){
				console.log('sort error!!!!!!!!');
			} else if(sortRes){
			//	expSort[i++] = sortRes;			
			//	console.log(sortRes);
				expSort = sortRes;
			}
		});		
		
		for(var z=0; z<expSort.length; z++){
//			console.log(expSort[z].username);	
			mem_info.update({username:expSort[z].username}, {$set:{rank:z}}, function(err, updateRes){
			/*	if(updateRes){
					console.log(updateRes);
				}*/
			});
			
		}

	});


}


//setInterval(cal_ranking, 60000);
setInterval(cal_ranking, 6000);
