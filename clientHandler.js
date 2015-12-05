var querystring = require('querystring');
var fs = require('fs');

var main = require('./game.js').game;
var croupier = require('./croupier.js').croupier;
var team = require('./team.js').team;

var m = {};
exports.m = m;

var game = new main.Game();

var noVacancy = function(req,res){
	res.statusCode = 403;
	console.log(req.method,res.statusCode,': Four Players are Already Playing.')
	res.end();
}
m.addPlayer = function(req,res){
	var data = '';
	console.log(req.url, 'URL');
	req.on('data',function(chunk){
		data += chunk;
	});
	var dummyGame = game;
	req.on('end',function(){
		var name = querystring.parse(data).name;
		var count = croupier.countPlayer(dummyGame);
		if(count == 4 && !req.headers.cookie){
			noVacancy(req,res);
			return;
		};

		if(!req.headers.cookie && count < 4){
			res.setHeader('set-cookie',[id = name]);
			var player = new team.Player(name);
			dummyGame = croupier.assignPlayer(dummyGame,player);
			console.log('----> ',name,' has been added to a team.')
		};
		// if(players.length == 4){
		// 	main.assignTeam(players).shuffle().distributeCards();
		// }
		res.writeHead(302,{Location:'waiting.html'});
		res.end();
	});
};
m.serveNeededCount = function(req,res){
	var neededPlayer = 4 - croupier.countPlayer(game);
	res.statusCode = 200;
	res.end(String(neededPlayer));	
	console.log(req.method,res.statusCode,': Needed Count Has Been Served.')
}