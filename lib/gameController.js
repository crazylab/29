var express = require('express');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

var createGame = require('./createGame');

app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/waiting.html', function(req, res){
	var game = req.game;
	var parameters = req.body;
	var name = parameters.name;
	res.cookie('name',name);
	if(game.addPlayer(name)){
		game.end = false;
		res.redirect('/waiting.html');
	}
	else
		res.status(403).send('4 players are already playing');
});
app.get('/waiting',function(req,res){
	var game = req.game;
	var playerNeeded = 4 - game.playerCount();
	res.send(playerNeeded.toString());
});
app.post('/leaveGame', function(req, res) {
	res.redirect('leave_game.html');
	req.game.end =  true;
});
app.post('/deal',function(req,res){
	var game = req.game;
	if(game.team_1.players[0].hand.length == 0){
		game.deck.shuffle();
		game.distributeCards();
		game.bid.player = game.distributionSequence[0].id;
	}
	res.end();
});
app.post('/setTrump',function(req,res){
	var game = req.game;
	if(game.trump.suit == undefined){
		var parameters = req.body;
		var cardID = parameters.trump;
		game.setTrumpSuit(cardID);
		res.status(202).end();
	}
});

app.post('/throwCard', function(req, res){
	var game = req.game;
	var parameters = req.body;
	var cardID = parameters.cardID;
	var playerID = req.cookies.name;
	var player = game.getPlayer(playerID);
	if(player.turn && game.isValidCardToThrow(cardID,player.hand)){
		var deletedCard = player.removeCard(cardID);
		game.playedCards.push({player:player.id,card:deletedCard,trumpShown:game.trump.open});
		game.nextTurn();
	}
	res.end();
});

app.get('/getTrump',function(req,res){
	var game = req.game;
	var playerID = req.cookies.name;
	var player = game.getPlayer(playerID);
	if(player.turn&&game.ableToAskForTrumpSuit(player.hand))
		res.send(game.getTrumpSuit());
	else
		res.status(406).send('Not Allowed');
});

app.get('/status',function(req,res){
	var game = req.game;
	if(game.end){
		var endStatus = {end: true};
		res.send(JSON.stringify(endStatus));
	}
	else{
		var playerID = req.cookies.name;
		var gameStatus = game.getStatus(playerID);
		res.send(JSON.stringify(gameStatus));
	}
});

var GameController = function(game){
	return function(req,res){
		if (game.end){
			game = createGame();
		}
		req.game = game;
		app(req,res);
	};
};

module.exports = GameController;
