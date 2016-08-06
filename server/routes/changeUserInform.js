var express = require('express');
var app = express();
var router = express.Router();

var username;
var g_mineral, g_gas, g_unknown;
var g_exp;

var MongoClient = require('mongodb').MongoClient;

var io = require('socket.io').listen(5003);

router.get('/', function(req, res, next){
	res.send('respond with a resource');
});

io.on('connection', function(socket){
	//user get resource -> change the user's informations
	socket.on('get_rsrc', function(data){
		username = data.username;
		//client must send to server the information of each resource that get quantity
		g_mineral = data.mineral;
		g_gas = data.gas;
		g_unknown = data.unknown;

		
	});

	//user get exp
	socket.on('get_exp', function(data){
		
	
	});

});





console.log('changeUserInform.js : https://203.237.179.21:5003');
