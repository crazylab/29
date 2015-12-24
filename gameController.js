var fs = require('fs')
var EventEmitter = require('events').EventEmitter;
var clientHandler = require('./clientHandler');
var method_not_allowed = function(req, res){
	res.statusCode = 405;
	// console.log(req.method,res.statusCode,': Method Not Allowed.');
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
			// console.log(req.method,res.statusCode,': '+filePath,'has been served');
			res.end(data);
		}
		else
			next();
	});
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	// console.log(req.method,res.statusCode,': '+req.url,'Not Found.');
};

var serveGamePage = function(req,res){
	req.url = '/gamePage.html';
	serveStaticFile(req,res);
};

var post_handlers = [
	{path: '^/waiting.html$', handler: clientHandler.addPlayer},
	{path: '^/setTrump$', handler: clientHandler.setTrumpSuit},
	{path: '^/throwCard$', handler: clientHandler.throwCard},
	{path: '', handler: method_not_allowed}
];
var get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/status$', handler: clientHandler.serveGameStatus},
	{path: '^/getTrump$', handler: clientHandler.getTrumpSuit},
	{path: '^/waiting$', handler: clientHandler.serveNeededCount},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
var rEmitter = new EventEmitter();

var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};
rEmitter.on('next', function(handlers, req, res, next){
	if(handlers.length == 0) 
		return;
	var ph = handlers.shift();
	ph.handler(req, res, next);
});
var handle_all_post = function(req, res){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
}; 
var handle_all_get = function(req, res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
};

var requestHandler = function(req, res){
	if(req.method == 'GET')
		handle_all_get(req, res);
	else if(req.method == 'POST')
		handle_all_post(req, res);
	else
		method_not_allowed(req, res);
};

var GameController = function(game){
	return function(req,res){
		req.game = game;
		requestHandler(req,res);
	};
};

module.exports = GameController;
