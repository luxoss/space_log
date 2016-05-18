var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var username, password, email;
var MongoClient = require('mongodb').MongoClient;

app.listen(3000);

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
 	// socket.emit('news', { hello: 'world' });
  	socket.on('login_msg', function (data) {
    		console.log(data);
		username = data.username;
		password = data.password;
		console.log(username + ', ' + password);	
		
		MongoClient.connect("mongodb://localhost/space_log", function(err,db){
			var adminDB = db.admin();
			adminDB.listDatabases(function(err, databases){
			//	console.log("Before find data from db : ");
			//	console.log("ID : " + username);
			//	console.log("PW : " + password);
			});
	
			var document ={"username" : username, "password" : password};
			db.collection("MEMBER").findOne(document, function(e){
				if(e){
					console.log("Finding data to DB is ERR : " + e);
					socket.emit('login_res', {response : 'false'});
					throw err;
				}
				else{
					console.log("Finding is Success!!!!!!!!!!!!!!!!!!!!!!!");
					socket.emit('login_res', {response : 'true'});
				}
				db.close();
			});
/*			if(db.collection("MEMBER").findOne(document, function (e){}) == true ){ //start if
				console.log("Success!!! Find data!");
			}//end if
			else{
				console.log("Failed..........T-T");
				console.log("USERNAME : " + username + ", PASSWORD : " + password);
			} */
		});		
  	});

  	socket.on('join_msg', function (data){
		console.log(data);
		username = data.username;
		password = data.password;
		email = data.email;
	});

});

console.log('Starting at http://52.79.132.7:3000');

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
