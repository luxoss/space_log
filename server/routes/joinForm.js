var express = require('express');
var router = express.Router();

var memObj;//Object that receive member information from client.

var username, password, email;

var mongodb = require('mongodb');
var MClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/space_log';

// Use connect method to connect to the Server
MClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

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

//	console.log(memObj.username);
//	console.log(memObj.password);
//	console.log(memObj.email);
	console.log(username);
	console.log(password);
	console.log(email);
	res.json(memObj);
	
});




module.exports = router;
