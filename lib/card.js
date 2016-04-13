var Card = function(name, suit, cardAttributes){
	this.id = suit[0]+name;
	this.suit = suit;
	this.name = name;
	this.point = cardAttributes[name].point;
	this.rank = cardAttributes[name].rank;
}

module.exports = Card;
