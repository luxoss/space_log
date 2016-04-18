MongoClient = require('mongodb').MongoClient;
 
var url = "mongodb://localhost/test";
 
function callback(r) {
    console.log("r:" + r);
}
 
MongoClient.connect(url, callback);
