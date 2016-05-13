var express = require('express');
var router = express.Router();

var memObj;//Object that receive member information from client.

var username, password, email;
var IP, PORT;


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('joinForm',{title: 'joinForm~~~~'});
});

router.post('/', function(req,res,next){
	console.log('req.body : ' + req.body);
	memObj = req.body;

	username = memObj.username;
	password = memObj.password;
	email = memObj.email;

	IP = memObj.ip;
	PORT = memObj.port;


	console.log("Variable : " + username);
	console.log("Variable : " + password);
	console.log("Variable : " + email);

	console.log("Client's IP Address : " + IP);
	console.log("client's PORT Address : " + PORT); 

	res.json(memObj);
////////////////////////	

	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/space_log", function(err,db){
	var adminDB = db.admin();
	adminDB.listDatabases(function(err, databases){
        	console.log("Before Add Database List: ");
	        console.log(databases);
		console.log("ID : " + username);
		console.log("PW : " + password);
		console.log("EM : " + email);
    	        });


//	var dbsuccess;

	var document = {"username" : username, "password" : password, "email" : email};
	db.collection("MEMBER").insert(document, function (err, records){
		if(err){
			//Send response value to Client(I need Client's IP address and Port number). This case response value is false
			console.log("Insert to Db ERR :" + err);
			throw err;
		}
		else{
			//response = true
			console.log("Success!!!!!!!!!!!!!!!!!!!");
		}
		//console.log(err);
		db.close();
	});

	});
//	console.log("DB Success ? " + dbsuccess);
//////////////////////////

});




module.exports = router;
