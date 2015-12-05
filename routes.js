var fs = require('fs');
var querystring = require('querystring');

var game = require('./game.js').game;
var clientHandler = require('./clientHandler.js').m;

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(req.method,res.statusCode,': Method Not Allowed.');
	res.end('Method is not allowed');
};
var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};
var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(req.method,res.statusCode,': '+filePath,'has been served');
			res.end(data);
		}
		else
			next();
	});
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(req.method,res.statusCode,': '+req.url,'Not Found.');
};

var serveGamePage = function(req,res){
	req.url = '/gamePage.html';
	serveStaticFile(req,res);
}
exports.post_handlers = [
	{path: '^/waiting.html$', handler: clientHandler.addPlayer},
	{path: '^/setTrump$', handler: clientHandler.setTrumpSuit},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/status$', handler: clientHandler.serveGameStatus},
	{path: '^/getTrump$', handler: clientHandler.getTrumpSuit},
	{path: '^/waiting$', handler: clientHandler.serveNeededCount},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];