var Card = require('./card.js');

var isInvalid = function(value, validValues){
	return validValues.indexOf(value) == -1;
}

var notifyIfError = function(name, suit){
	var validCardNames = ['7','8','9','10','J','Q','K','A'];
	if(isInvalid(name, validCardNames))
		throw new Error('Invalid card name');

	var validSuits = ['Heart','Spade','Club','Diamond'];
	if(isInvalid(suit, validSuits))
		throw new Error('Invalid card suit');
}

var createCard = function(name, suit){
	notifyIfError(name, suit);

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
	return Object.freeze(new Card(name, suit, cardAttributes));
}
module.exports = createCard;
