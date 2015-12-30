var ld = require('lodash');

var generateCards = require('./generateCards.js');

var Deck = function(cards){
	this.getCards = function(){
		return cards;
	};
	this.drawFourCards = function(){
		return cards.splice(0,4);
	}
	this.shuffle = function(){
		cards = ld.shuffle(cards);
		return cards;
	}
};

var createDeck = function(cards) {
	return new Deck(cards);
};

module.exports = createDeck;