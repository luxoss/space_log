var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
//var : join = require('./routes/joinForm');//New add(Join)
var login = require('./routes/loginForm');//New add(Login)
//new : create Planet
var createPlanet = require('./routes/createPlanet');
//new : send Planet
var sendPlanet = require('./routes/sendPlanet');
///new : develope the planet
var devPlanet = require('./routes/devPlanet');
//new : improve Planet
var improvePlanet = require('./routes/improvePlanet');
//new : users' last position
var lastPosition = require('./routes/lastPosition');
//new : changing the users' information
var changeUserInform = require('./routes/changeUserInform');
//new : changing the users' planet informnation
var changeUserPlanet = require('./routes/changeUserPlanet');
//new : Sending all Users' position
var broadcastPos = require('./routes/broadcastPos');
//new : Increase user's resource and decrease planet's resource for develop Planet
var indecreaseRsc = require('./routes/indecreaseRsc.js');
//new : Calculating user's ranking
var ranking = require('./routes/ranking.js');


//test Mongodb
//var MongoClient = require('mongodb').MongoClient;


var app = express();


console.log('Server : http://203.237.179.21:3000');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//new add
app.use(express.static(path.join(__dirname, 'public/javascripts')));


app.use('/', routes);
app.use('/users', users);
//app.use('/join', join);//New add(Join)
app.use('/login', login);//New add(Login)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
