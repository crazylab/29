var deckLib = require('./deck.js').m;
var teamLib = require('./teamFormation.js').team;

var croupier = {};
exports.croupier = croupier;

croupier.getShuffledCards = function(){
	var deck = new deckLib.Deck();
	var shuffledDeck = deck.shuffle(deck.cards);
	return shuffledDeck;
};