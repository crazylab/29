var http = require('http');
var fs = require('fs');
var players = [];

var serveStaticFile = function(req,res){
	if(req.url === '/')
		req.url = '/index.html';
	var path = './public' + req.url;
	fs.readFile(path, function(err,data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			res.statusCode = 404;
			console.log(res.statusCode);
			res.end('Not Found');
		}
	});
}
var handle_get = function(req,res){
	serveStaticFile(req,res);
}
var handle_post = function(req,res){

}
var method_not_allowed = function(req,res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method Not Allowed');
}
var requestHandler = function(req, res){
	var ip = req.connection.remoteAddress;
	console.log('user request: ',req.url);
	if(req.method === 'GET')
		handle_get(req,res);
	else if(req.method === 'POST')
		handle_post(req,res);
	else
		method_not_allowed(req,res);
};

http.createServer(requestHandler).listen(8000);;