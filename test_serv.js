var http = require('http');
var qStr = require('querystring');

http.createServer(function(req, res){
	if(req.url == '/' && req.method == 'POST'){
		var postBody = '';
		req.on('data', function(data){
			postBody += data;
		});
		req.on('end', function(){
			var post = qStr.parse(postBody);
			console.log(post);
		});
	}else{
		res.writeHead(404, {'content-type':'text/plain'});
		res.end('404 ERROR');
	}
}).listen(8080);

console.log("Starting server at 8080 port");

