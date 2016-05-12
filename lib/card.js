var Card = function(name, suit){
	var cardAttributes = {
		'7' : {point: 0, rank: 8},
		'8' : {point: 0, rank: 7},
		'9'	: {point: 2, rank: 2},
		'10': {point: 1, rank: 4},
		'J' : {point: 3, rank: 1},
		'Q' : {point: 0, rank: 6},
		'K' : {point: 0, rank: 5},
		'A' : {point: 1, rank: 3}
	};
	this.id = suit[0]+name;
	this.suit = suit;
	this.name = name;
	this.point = cardAttributes[name].point;
	this.rank = cardAttributes[name].rank;
}

Card.prototype = {
	isOfSuit : function(suit){
		return this.suit == suit;
	},

	getID : function(){
		return this.id;
	}
}
module.exports = Card;
