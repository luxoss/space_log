var express = require('express');
var router = express.Router();

var memObj;//Object that receive member information from client.

var username, password;
var IP, PORT;

var io;


/* GET users listing. */

router.get('/', function(req, res, next) {
	res.render('loginForm',{title: 'loginForm~~~~'});
});



io=require('socket.io')();

io.sockets.on('connection', function(socket){
	console.log('Connect with client!!!')
	socket.on('login_msg', function(data){
		console.log(data);
	});
});



router.post('/', function(req,res,next){
	console.log('req.body : ' + req.body);
	memObj = req.body;

	username = memObj.username;//Undefined name
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




module.exports = router;
