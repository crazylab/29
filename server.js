var http = require('http');
var fs = require('fs');
var ld = require('lodash'); 
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
// ------------------------------------------------
var routes = require('./routes.js');
var main = require('./main.js');
var croupier = require('./croupier.js').croupier;
//-------------------------------------------------
const PORT = 3000;
// ------------------------------------------------
var get_handlers = routes.get_handlers;
var post_handlers = routes.post_handlers;
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
	console.log(handlers.map(function(ph){
		return ph.path;
	}));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
}; 
var handle_all_get = function(req, res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	console.log(handlers.map(function(ph){
		return ph.path;
	}));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, next);
	};
	next();
};

var requestHandler = function(req, res){
	console.log(req.method, req.url);
	if(req.method == 'GET')
		handle_all_get(req, res);
	else if(req.method == 'POST')
		handle_all_post(req, res);
	else
		method_not_allowed(req, res);
};
http.createServer(requestHandler).listen(PORT).on('error',function(err){
	console.log(err.message);
});