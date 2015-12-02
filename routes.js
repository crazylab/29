var fs = require('fs');
var querystring = require('querystring');

var main = require('./main.js');
var croupier = require('./croupier.js').croupier;

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
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
			console.log(res.statusCode);
			res.end(data);
		}
		else
			next();
	});
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};
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
var setTrumpSuit = function (req, res) {
	var data = '';
	req.on('data',function(chunk){
		data += chunk;
	});
	req.on('end',function(){
		main.game.trump.suit = data;
		res.end();
	});
};
var getTrumpSuit = function (req, res) {
	res.statusCode = 200;
	var data = main.game.trump.suit;
	res.end(data);
};
var players = []; 		//Need to Change
var servePostPages = function(req,res,next){
	var ip = req.connection.remoteAddress;
	var data = '';
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

		if(count == 4 && !req.headers.cookie)
			next();

		if(players.length == 4)
			main.gameHandler(players);

		res.writeHead(302,{Location:'gamePage.html'});
		res.end(data);
	});
};
exports.post_handlers = [
	{path: '^/gamePage.html$', handler: servePostPages},
	{path: '^/setTrump$', handler: setTrumpSuit},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '^/status$', handler: serveGameStatus},
	{path: '^/getTrump$', handler: getTrumpSuit},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];