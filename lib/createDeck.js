var ld = require('lodash');

var generateCards = require('./generateCards.js');

var Deck = function(cards){
	this.getCards = function(){
		return cards;
	};
	this.drawFourCards = function(){
		return cards.splice(0,4);
	};
	this.shuffle = function(){
		cards = ld.shuffle(cards);
		return cards;
	};
	this.recollectCards = function(team1_cards, team2_cards){
		cards = team1_cards.concat(team2_cards);
		return cards;
	}
};

var createDeck = function(cards) {
	return new Deck(cards);
};

module.exports = createDeck;