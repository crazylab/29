var http = require('http');
var fs = require('fs');
var ld = require('lodash'); 
var querystring = require('querystring');

var main = require('./main.js');
var croupier = require('./croupier.js').croupier;

const PORT = 3000;

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
var serveGameStatus = function(req,res){
	res.statusCode = 200;
	console.log(res.statusCode);
	var gameStatus = croupier.getStatus();
	res.end(JSON.stringify(gameStatus));
};
var savePlayers = function(players,id){
	players.push(id);
	return players;
};
var handle_get = function(req,res){
	var innerRequest = {
		'/status' : serveGameStatus
	}
	if(innerRequest[req.url] !== undefined){
		innerRequest[req.url](req,res);
		return;
	}
	serveStaticFile(req,res);
};

var handle_post = function(req,res){
	servePostPages(req,res);
};

var method_not_allowed = function(req,res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method Not Allowed');
}
var players = [];
var servePostPages = function(req,res){
	var ip = req.connection.remoteAddress;
	var data = '';
	req.on('data',function(chunk){
		data +=chunk;
	});
	req.on('end',function(){
		var count = players.length; 
		var name = querystring.parse(data).name;

		if(!req.headers.cookie && players.length < 4){
			res.setHeader('set-cookie',[id = ip+'_'+name]);
			savePlayers(players,ip+'_'+name);
		};

		if(count == 4 && !req.headers.cookie)
			method_not_allowed(req,res);

		if(players.length == 4)
			main.gameHandler(players);

		res.writeHead(302,{Location:'gamePage.html'});
		res.end(data);
	});
};

var requestHandler = function(req, res){
	console.log('user request: ',req.url,req.method);
	if(req.method === 'GET')
		handle_get(req,res);
	else if(req.method === 'POST')
		handle_post(req,res);
	else
		method_not_allowed(req,res);
};

var server=http.createServer(requestHandler).listen(PORT);
server.on('error',function(e){
	console.log(e.message);
});
