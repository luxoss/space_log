var express = require('express');
var router = express.Router();

var memObj;//Object that receive member information from client.

var username, password;

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('loginForm',{title: 'loginForm~~~~'});
});

router.post('/', function(req,res,next){
	console.log('req.body : ' + req.body);
	memObj = req.body;

	username = memObj.username;
	password = memObj.password;

	console.log("Variable : " + username);
	console.log("Variable : " + password);

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
    	        });
	
	db.collection("MEMBER").findOne({"username" : username, "password" : password}, function (e){
		console.log(e);
		db.close();
	});

	});

//////////////////////////

});




module.exports = router;
