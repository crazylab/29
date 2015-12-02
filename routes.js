var fs = require('fs');
var querystring = require('querystring');

var main = require('./main.js').game;

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
var players = []; 		//Need to Change
var savePlayers = function(players,id){
	players.push(id);
	return players;
};
var servePostPages = function(req,res,next){
	var ip = req.connection.remoteAddress;
	var data = '';
	console.log(req.url)
	req.on('data',function(chunk){
		data += chunk;
	});
	req.on('end',function(){
		var count = players.length; 
		var name = querystring.parse(data).name;

		if(!req.headers.cookie && players.length < 4){
			res.setHeader('set-cookie',[id = ip+'_'+name]);
			savePlayers(players,ip+'_'+name);
		};
		if(count == 4 && !req.headers.cookie){
			res.statusCode = 403;
			console.log(req.method,res.statusCode,': Four Players are Already Playing.')
			res.end();
			return;
		}
		if(players.length == 4){
			main.assignTeam(players).shuffle().distributeCards();
		}
		res.writeHead(302,{Location:'gamePage.html'});
		res.end();
	});
};
var serveGamePage = function(req,res){
	req.url = '/gamePage.html';
	serveStaticFile(req,res);
}
var serveGameStatus = function(req,res,next){
	console.log(players);
	if(players.length != 4){
		res.statusCode = 406;
		console.log(req.method,res.statusCode,': Not Enough Player to Play.');
		next();
		return;
	}
	res.statusCode = 200;
	console.log(res.statusCode,': Status Sent.');
	var gameStatus = main.getStatus(req.headers.cookie);
	console.log(gameStatus);
	res.end(JSON.stringify(gameStatus));
};
exports.post_handlers = [
	{path: '^/gamePage.html$', handler: servePostPages},
	{path: '', handler: serveGamePage},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/status$', handler: serveGameStatus},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];