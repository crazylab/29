var querystring = require('querystring');
var ld = require('lodash');
var fs = require('fs');

var main = require('./game.js').game;
var croupier = require('./croupier.js').croupier;
var team = require('./team.js').team;

var m = {};
exports.m = m;

var storeCurrentGame = function(game){
	fs.writeFile('./database/gameInstance.json',JSON.stringify(game),function(err){
		if(err)
			console.log('err');
		else 
			console.log('Game Saved');
	});
};

var readCurrentGame = function(){
	var data = fs.readFileSync('./database/gameInstance.json','utf8');
	return JSON.parse(data);
};

var initializeGame = ld.once(croupier.makeNewGame);
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
	req.on('end',function(){
		var instanceOfGame = initializeGame();
		var name = querystring.parse(data).name;

		if(instanceOfGame) 
			var game = instanceOfGame;

		var count = croupier.countPlayer(game);
		if(count == 4 && !req.headers.cookie){
			noVacancy(req,res);
			return;
		};

		if(!req.headers.cookie && count < 4){
			res.setHeader('set-cookie',[id = name]);
			var player = new team.Player(name);
			var game = croupier.assignPlayer(game,player);
		};
		storeCurrentGame(game);
		// if(players.length == 4){
		// 	main.assignTeam(players).shuffle().distributeCards();
		// }
		res.writeHead(302,{Location:'waiting.html'});
		res.end();
	});
};
m.serveNeededCount = function(req,res){
	var game = readCurrentGame();
	var neededPlayer = 4 - croupier.countPlayer(game);
	res.statusCode = 200;
	res.end(String(neededPlayer));	
	console.log(req.method,res.statusCode,': Needed Count Has Been Served.')
}