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
		if(croupier.countPlayer(game) == 4){
			game.setDistributionSequence().shuffleDeck();
			croupier.distributeCards(game);
		}
		res.writeHead(302,{Location:'waiting.html'});
		res.end();
	});
};
m.serveNeededCount = function(req,res){
	var neededPlayer = 4 - croupier.countPlayer(game);
	res.statusCode = 200;
	res.end(String(neededPlayer));	
	console.log(req.method,res.statusCode,': Needed Count Has Been Served.')
};
m.serveGameStatus = function(req,res,next){
	if(croupier.countPlayer(game) != 4){
		res.statusCode = 406;
		console.log(req.method,res.statusCode,': Not Enough Player to Play.');
		next();
		return;
	}
	res.statusCode = 200;
	console.log(res.statusCode,': Status Sent.');
	var gameStatus = game.getStatus(req.headers.cookie);
	console.log(gameStatus);
	res.end(JSON.stringify(gameStatus));
};

m.setTrumpSuit = function (req, res) {
	var data = '';
	req.on('data',function(chunk){
		data += chunk;
	});
	req.on('end',function(){
		game.setTrumpSuit(data);
		console.log('Trump suit has been set');
		res.end();
	});
};

m.throwCard = function (req, res) {
	var cardID = '';
	req.on('data',function(chunk){
		cardID += chunk;
	});
	req.on('end',function(){
		var playerId = req.headers.cookie;
		var player = game.getPlayer(playerId);
		var deletedCard = player.removeCard(cardID);
		game.playedCards.push(deletedCard);
		console.log(cardID,'  has been removed from',player.id);
		res.statusCode = 200;
		res.end();
	});
};
m.getTrumpSuit = function (req, res) {
	res.statusCode = 200;
	var data = game.getTrumpSuit();
	console.log('Trump suit '+ data +' has been revealed');
	res.end(data);
};