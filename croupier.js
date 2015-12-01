var cardLib = require('./cardGenerator.js');
var teamLib = require('./teamFormation.js').team;
var ld = require('lodash');

var croupier = {};
exports.croupier = croupier;

var shuffle = function(cards){
	cards = ld.shuffle(cards);
	return cards;	
};

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

croupier.getShuffledDeck = function(){
	var deck = cardLib.generateCards();
	var shuffledDeck = shuffle(deck);
	return shuffledDeck;
};

croupier.makeTeams = function(uniqueIds){
	var team_1 = new teamLib.Team(uniqueIds[0],uniqueIds[2]);
	var team_2 = new teamLib.Team(uniqueIds[1],uniqueIds[3]);
	return {team_1:team_1, team_2:team_2};
};

croupier.dealCardsToAPlayer = function(dealtCards,player){
	var existingHand = player.hand;
	dealtCards.forEach(function(card){
		existingHand[card.suit].push(card);
	});
	return player;
};
