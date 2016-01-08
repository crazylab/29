var Game = require('./game');
var generateCards = require('./generateCards');
var createDeck = require('./createDeck');

var createGame = function () {
	var cards = generateCards();
	var deck = createDeck(cards);
	return new Game(deck);
};

module.exports = createGame;
