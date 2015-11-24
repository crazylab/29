var deckLib = require('./deck.js').m;
var teamLib = require('./teamFormation.js').team;
var ld = require('lodash');
var croupier = {};
exports.croupier = croupier;

croupier.bid = {
	value : null,
	player : null
};
croupier.setBid = function (playerSequence) {
	var self = this;
	var index = 0;
	return function (value) {
		var challenger = index == 1;
		var pass = value == 'pass';
		if(pass){
			ld.pull(playerSequence,playerSequence[index]);
			index = 1 - index;
			return;
		}
		if (self.bid.value >= value && challenger) {
			return Error('Bid should be greater than ',self.bid.value);
		};
		if (value < 16 || value > 28) {
			return Error('Bid should be between 16 & 28');
		}
		self.bid.value = value;
		self.bid.player = playerSequence[index];
		index = 1 - index;
	}
};
croupier.getShuffledCards = function(){
	var deck = new deckLib.Deck();
	var shuffledDeck = deck.shuffle(deck.cards);
	return shuffledDeck;
};