var Game = require('./game');
var generateCards = require('./generateCards');
var createDeck = require('./createDeck');

var cards = generateCards();
var deck = createDeck(cards);

var createGame = function () {
	return new Game(deck);
};

module.exports = createGame;
