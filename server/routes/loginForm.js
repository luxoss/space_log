
var app = require('../app');
var io = require('socket.io')(app);

var fs = require('fs');

var express = require('express');
var router = express.Router();

var username, password, email;
var MongoClient = require('mongodb').MongoClient;

function handler (req, res) {
  	fs.readFile('/home/ubuntu/nodejs/Github/space_log/client/index.html',
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
			var collection = db.collection("MEMBER");
			collection.findOne(findByUsrname, function(err, findres){
				if(err){
					console.log("ERROR!!!!!!!!!!!!");
					console.log(err);
					socket.emit('login_res', {response : 'false'});
				} else if(findres){
					console.log("Find Success!!!!!!!!!!!!!!");
					
					if(findres.password == password && findres.accessing == "false"){
						console.log("Match the password!!!! findres.password : " + findres.password);
						collection.update({"username" : username},{$set : {"accessing" : "true"}});
						socket.emit('login_res', {response : 'true'});
					} else{
						console.log("No match the password T-T.... " + findres.password);
						socket.emit('login_res', {response : 'false'});
					}
				}
			
			});			
		});		
  	});// Login part over


	//Join part start
  	socket.on('join_msg', function (data){
		console.log(data);
		username = data.username;
		password = data.password;
		email = data.email;
		
		console.log(username + ', ' + password + ', ' + email);

		MongoClient.connect("mongodb://localhost/space_log", function(err, db){

			//console.log(err);

			var adminDB = db.admin(); 
			adminDB.listDatabases(function(err, databases){ 
				if(err){
					console.log('Mongodb admin Error T0T......');
				}
				else{
					console.log('admin is success');
				}
			});

			//This is ok

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
		
	});

});


console.log('Starting at http://52.79.132.7:8888');

module.exports = router;
//Finish The login join system


/*
var express= require('express');
var io = require('socket.io')();
var router = express.Router();
var memObj;//Object that receive member information from client.
var username, password;
var IP, PORT;

// GET users listing.
router.get('/', function(req, res, next) {
	res.render('loginForm',{title: 'loginForm~~~~'});
});
router.post('/', function(req,res,next){
	console.log('req.body : ' + req.body);
	memObj = req.body;
	username = memObj.username;//Undefined name;
	password = memObj.password;
	//
	IP = memObj.ip;
	PORT = memObj.port;

	console.log("Variable : " + username);
	console.log("Variable : " + password);
//	console.log("Client's IP address" + IP);
//	console.log("client's PORT number" + PORT);
	res.json(memObj);
////////////////////////////////
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/space_log", function(err,db){
	var adminDB = db.admin();
	adminDB.listDatabases(function(err, databases){
        	console.log("Before Add Database List: ");
	        console.log(databases);
		console.log("ID : " + username);
		console.log("PW : " + password);
    	        });

	db.collection("MEMBER").findOne({"username" : username, "password" : password}, function (e){
		console.log(e);
		db.close();
	});

	});

//////////////////////////

});



*/
//module.exports = router;
