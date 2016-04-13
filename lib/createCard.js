var Card = function(name,suit){
	var cardPoint = {
		'7' : 0,
		'8' : 0,
		'9'	: 2,
		'10': 1,
		'J' : 3,
		'Q' : 0,
		'K' : 0,
		'A' : 1
	};
	var cardRank = {
		'7' : 8,
		'8' : 7,
		'9'	: 2,
		'10': 4,
		'J' : 1,
		'Q' : 6,
		'K' : 5,
		'A' : 3
	};

	this.id = suit[0]+name;
	this.suit = suit;
	this.name = name;
	this.point = cardPoint[name];
	this.rank = cardRank[name];
}

var createCard = function(name, suit){
	return Object.freeze(new Card(name, suit));
}
module.exports = createCard;
