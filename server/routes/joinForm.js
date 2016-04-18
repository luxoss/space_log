var express = require('express');
var router = express.Router();

var memObj;//Object that receive member information from client.

//var mongodb = require('mongodb');
//var MClient = mongodb.MongoClient;
//var url = 'mongodb://localhost:27017/admin';


var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost/admin", function(err,db){
    var adminDB = db.admin()
    adminDB.listDatabases(function(err, databases){
        console.log("Before Add Database List: ");
        console.log(databases);
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('joinForm',{title: 'joinForm~~~~'});
});

router.post('/', function(req,res,next){
	console.log('req.body : ' + req.body);
	memObj = req.body;

	console.log(memObj.username);
	console.log(memObj.password);
	console.log(memObj.email);
	res.json(memObj);
	
});

module.exports = router;
