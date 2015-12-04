var querystring = require('querystring');
var ld = require('lodash');

var main = require('./game.js').game;
var croupier = require('./croupier.js').croupier;
var team = require('./team.js').team;

var m = {};
exports.m = m;

var initializeGame = ld.once(croupier.makeNewGame);
m.addPlayer = function(req,res,next){
	var data = '';
	console.log(req.url, 'URL');
	req.on('data',function(chunk){
		data += chunk;
	});
	req.on('end',function(){
		var instanceOfGame = initializeGame();
		var name = querystring.parse(data).name;

		if(instanceOfGame) 
			var game = instanceOfGame;

		var count = croupier.countPlayer(game);
		if(count == 4 && !req.headers.cookie){
			res.statusCode = 403;
			console.log(req.method,res.statusCode,': Four Players are Already Playing.')
			res.end();
			return;
		};

		if(!req.headers.cookie && count < 4){
			res.setHeader('set-cookie',[id = name]);
			var player = new team.Player(name);
			var game = croupier.assignPlayer(game,player);
		};
		// if(players.length == 4){
		// 	main.assignTeam(players).shuffle().distributeCards();
		// }
		res.writeHead(302,{Location:'waiting.html'});
		res.end();
	});
};