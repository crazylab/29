var http = require('http');
var Game = require('./lib/game');
var createDeck = require('./lib/createDeck');
var generateCards = require('./lib/generateCards');
var GameController = require('./lib/gameController');

var cards = generateCards();
var deck = createDeck(cards);
var controller = GameController(new Game(deck));
const PORT = 3456;
http.createServer(controller).listen(PORT).on('error',function(err){
	console.log(err.message);
});