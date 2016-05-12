var createCard = require('./createCard.js');

var generateCards = function(){
	var names = ['7','8','9','10','J','Q','K','A'];
	var suits = ['Heart','Spade','Club','Diamond'];

	var cards = [];

	suits.forEach(function(suit){
		var sameSuitCards = names.map(function(name){
			return createCard(name,suit);
		});
		cards = cards.concat(sameSuitCards);
	});

	return cards;
};
module.exports = generateCards;
