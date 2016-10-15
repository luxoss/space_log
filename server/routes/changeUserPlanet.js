/*
var express = require('express');
var app = express();
var router = express.Router();

var username="";
var p_id="";

var MongoClient = require('mongodb').MongoClient;

var io = require('socket.io').listen(5004);

router.get('/', function(req, res, next){
	res.send('respond with a resource');
});

io.on('connection', function(socket){
	//user get Planet -> add to DB
	socket.on('add_p', function(data){
	
	});

	//user remove planet -> delete to DB
	socket.on('rmv_p', function(data){
	
	});
});
*/
