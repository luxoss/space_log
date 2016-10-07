var fs = require('fs');

var express = require('express');
var app = express();
var router = express.Router();

var username="", password="", email="";

var x=0, y=0, obj={};

var sendinfo={};
var openinfo={};

var MongoClient = require('mongodb').MongoClient;

var io = require('socket.io').listen(5001);

/* GET home page. */
router.get('/', function(req, res, next){
//	res.render('login', {title : 'login'});
	res.send('respond with a resource');
});

function handler (req, res) {
  	fs.readFile('/home/jaesun/Git/space_log/client/index.html',
  	function (err, data) {
    	if (err) {
      		res.writeHead(500);
      		return res.end('Error loading index.html  ' + err);
    	}

    	res.writeHead(200);
   	 res.end(data);
  	});
}

io.on('connection', function (socket) {

	console.log('login form - start io.on(connect)');

 	// Login Part start
  	socket.on('login_msg', function (data) {
    		console.log(data);
		username = data.username;
		password = data.password;
		console.log(username + ', ' + password);	
		
		MongoClient.connect("mongodb://localhost/space_log", function(err,db){
			var adminDB = db.admin();
			adminDB.listDatabases(function(err, databases){	});
	

			var findByUsrname = {"username" : username};
			var member = db.collection("MEMBER");
			var mem_info = db.collection("MEM_INFO");
			
			member.findOne(findByUsrname, function(err, findres){
				if(err){
					console.log("ERROR!!!!!!!!!!!!");
					console.log(err);
					socket.emit('login_res', {response : 'false'});
				} else if(findres){
										
					if(findres.password == password && findres.accessing == "false"){
						console.log("Match the password!!!! findres.password : " + findres.password);
						member.update({"username" : username},{$set : {"accessing" : "true"}});
						socket.emit('login_res', {response : 'true'});
						
						socket.join('playing');//this socket binding at playing group(room)
						
						mem_info.findOne(findByUsrname, function(err, userinfo){
							sendinfo = {
								"username" 	: userinfo.username, 
								"exp" 		: userinfo.exp, 
								"mineral" 	: userinfo.mineral, 
								"gas" 		: userinfo.gas, 
								"unknown" 	: userinfo.unknown, 
								"location_x" 	: userinfo.location_x, 
								"location_y" 	: userinfo.location_y, 
								"gold" 		: userinfo.gold
							}	
							socket.emit('user_info', sendinfo);

							


						/*	openinfo ={
								"username"   : userinfo.username,
								"location_x" : userinfo.location_x,
								"location_y" : userinfo.location_y
							};
							io.emit('users_info', openinfo);
						*/	
												
						});
					
					} else{
						console.log("No match the password T-T.... " + findres.password);
						socket.emit('login_res', {response : 'false'});
					}
				}
			
			});			
		});		
  	});// socket.on('login_msg', function(){}); end
	
	/*
	socket.on('update_pos_req', function(data){
		console.log('======= I got update_pos_req============================');

		x = data.location_x;	
		y = data.location_y;
		username = data.username;
		obj = {"username": username, "location_x" : x, "location_y" : y};
	
	});
	setInterval(function(){
		io.emit('update_pos_res', obj);
	
	}, 1000);
*/


/*
	socket.on('init_display', function(data){
		if(data.state == 'on'){
			socket.emit('init_display', {"display" : "true"});
			console.log("======================== display : state is on +++++++++++++++++++++++++");
			MongoClient.connect("mongodb://localhost/space_log", function(err, db){
				var mem_info
			});
			io.emit('playing_mem', {"username" :});
		}		
			
	});
*/	

	//Join part start
  	socket.on('join_msg', function (data){
		console.log(data);
		username = data.username;
		password = data.password;
		email = data.email;
		
		console.log(username + ', ' + password + ', ' + email);

		MongoClient.connect("mongodb://localhost/space_log", function(err, db){

			var adminDB = db.admin(); 
			adminDB.listDatabases(function(err, databases){ 
				if(err){
					console.log('Mongodb admin Error T0T......');
				}
				else{
					console.log('admin is success');
				}
			});

			var chckByUsrname = {"username" : username};
			var collection = db.collection("MEMBER");
			collection.findOne(chckByUsrname, function(err, chckres){ // Is there exist that getting username?

				console.log("var collection : " + collection);
				console.log("var chckByUsrname : " + chckByUsrname['username']);
	
				if(err){
					console.log("findOne() is error");
		
				}
				else{
					console.log("findOne() is ok");
					console.log("chckres value is : " + chckres);
 
					if(chckres == null){
						console.log('Ther is no data of matching username. Save the data');
						collection.insert({"username" : username, "password" : password , "email" : email, "accessing" : "false"},  function(err, insertres){
							if(err){
								console.log('err : ' + err);
								socket.emit('join_res', {response : 'false'});
							}
							else{
								socket.emit('join_res', {response : 'true'});
								var sampleX = Math.floor(Math.random()*5000-1);
								var sampleY = Math.floor(Math.random()*5000-1);
								
								db.collection("MEM_INFO").insert({"username" : username, "exp" : 0, "mineral" : 0, "gas" : 0, "unknown" : 0, "location_x" : sampleX, "location_y" : sampleY});
							}
						});
						
					} else{
						console.log("The data is already exist");	
						socket.emit('join_res', {response : 'false'});
					}
				}
				console.log("no return");		
			});
			
			
		});
		
	});//socekt.on('join_msg', function(){}); end

	//logout part start
	socket.on('logout_msg', function(data){
		username = data.username;
		console.log('logout user : ' + username);
		
		MongoClient.connect("mongodb://localhost/space_log", function(err, db){
			var adminDB = db.admin();
			adminDB.listDatabases(function(err, databases){
				if(err){
					console.log('Mongodb admin Error T0T..........');
				}
			});
			var chckByUsrname = {"username" : username};
			var collection = db.collection("MEMBER");
			collection.update(chckByUsrname , {$set : {"accessing" : "false"}}, function(err, chckres){
				if(err){
					console.log("logout err. Maybe there are no username");
					socket.emit('logout_res', {response : 'false'});
				} else{
					
					socket.emit('logout_res', {response : 'true'});
					socket.leave('playing');//leave the playing group
				}
			});
		});
		
	});//lsocket.on('logout_msg', function(){}); end
/*
	function sendPosInterval(){
		console.log('//////////////////////////////');
		console.log(sendinfo.username);
		socket.emit('user_info', sendinfo);
	}	

	setInterval(sendPosInterval,1000);
	*/

});


console.log('loginForm.js : http://203.237.179.21:5001');

module.exports = router;
//Finish The login join system
