var ld = require('lodash');
var m = {};
m.Card = function(name,suit){
	var cardPoint = {
		'7' : 0,
		'8' : 0,
		'9'	: 2,
		'10': 1,
		'J' : 3,
		'Q' : 0,
		'K' : 0,
		'A' : 1
	}
	var cardRank = {
		'7' : 8,
		'8' : 7,
		'9'	: 2,
		'10': 4,
		'J' : 1,
		'Q' : 6,
		'K' : 5,
		'A' : 3
	}
	this.name = name;
	this.suit = suit;
	this.point = cardPoint[name];
	this.rank = cardRank[name];
}
var generateCards = function(){
	var names = ['7','8','9','10','J','Q','K','A'];
	var suits = ['Heart','Spade','Club','Diamond'];
	var cards = [];
	for(var index = 0; index < suits.length; index++){
		var sameSuitCards = names.map(function(name){
			return new m.Card(name,suits[index]);
		});
		cards = cards.concat(sameSuitCards);
	};
	return cards.reverse();
};
m.Deck = function(){
	this.cards = generateCards();
}
m.Deck.prototype = {
	get dealCards(){
		if(this.cards.length == 0)
			return new Error('No more cards available.');
		return this.cards.splice(this.cards.length - 4,4);
	},
	shuffle : function(cards){
		this.cards = ld.shuffle(cards);
		return this;	
	}
}

exports.m = m;