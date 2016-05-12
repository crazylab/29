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
	return Object.freeze(new Card(name, suit));
}
module.exports = createCard;
