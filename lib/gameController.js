var express = require('express');
var queryString = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require ('lodash');

var app = express();

var createGame = require('./createGame');
var gameStore = require('./gameStore');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public/free/'));

app.use('/add_player',function (req, res, next) {
	var latestGame = gameStore.getLatestGame();
	if(!latestGame || latestGame.playerCount() == 4){
		var game = createGame();
		gameStore.addGame(game);
		latestGame = game;
	}
	req.game = latestGame;
	next();
});

app.post('/add_player', function(req, res){
	var game = req.game;
	var parameters = req.body;
	var gameID = game.getID();
	res.cookie('gameID', gameID);
	var name = parameters.name;
	res.cookie('name',name);
	var id = _.uniqueId('player_');
	res.cookie('id', id);
	if(game.addPlayer(id)){
		game.end = false;
		res.redirect('/waiting.html');
	}
	else
		res.status(403).send('You are not Allowed');
});

var authenticate = function(req, res, next){
	var gameID = req.cookies.gameID;
	req.game = gameStore.getGame(gameID);

	if(req.game && req.game.isNotActive()){
		gameStore.deleteGame(gameID);
		return;
	}
	var playerID = req.cookies.id;
	if(req.game && req.game.getPlayer(playerID))
		next();
	else
		res.redirect('index.html');
}
app.use(authenticate);
app.use(express.static('./public'));

app.get('/playerCount',function(req,res){
	var game = req.game;
	var playerNeeded = 4 - game.playerCount();
	res.send(playerNeeded.toString());
});
app.post('/leave_game.html', function(req, res) {
	req.game.end =  true;
	res.redirect('leave_game.html');
});
app.post('/deal',function(req,res){
	var game = req.game;
	if(game.team_1.players[0].hand.length == 0){
		game.gameInitializer();
		game.deck.shuffle();
		game.distributeCards();
		if(game.hasFirstPlayerGetAPoint())
			game.setBidderTurn();
	}
	res.send();
});
app.post('/bid', function(req, res){
	var game = req.game;
	var playerID = req.cookies.id;
	var bidValue = req.body.value;
	if(game.getCurrentBidder() == playerID ){
		game.setBid(playerID, bidValue);
		res.status(202).send();
	}
	res.status(406).send();
});
app.post('/setTrump',function(req,res){
	var game = req.game;
	var playerID = req.cookies.id;
	if(game.trump.suit == undefined){
		var parameters = req.body;
		var cardID = parameters.trump;
		game.setTrumpSuit(cardID, playerID);
		res.status(202).send();
	}
	res.status(406).send();
});

app.post('/throwCard', function(req, res){
	var game = req.game;
	var parameters = req.body;
	var cardID = parameters.cardID;
	var playerID = req.cookies.id;
	var status = game.playCard(playerID, cardID);
	if(status)
		res.status(200).send();
	res.status(406).send();
});

app.get('/getTrump',function(req,res){
	var game = req.game;
	var playerID = req.cookies.id;
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
		var playerID = req.cookies.id;
		var gameStatus = game.getStatus(playerID);
		res.send(JSON.stringify(gameStatus));
	}
});

var GameController = function(game){
	return function(req,res){
		app(req,res);
	};
};

module.exports = GameController;
