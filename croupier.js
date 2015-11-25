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

var makeTeams = function(playerNames,ids){
	var team_1 = new teamLib.Team({name:playerNames[0], id:ids[0]},
									{name:playerNames[2], id:ids[2]});
	var team_2 = new teamLib.Team({name:playerNames[1], id:ids[1]},
									{name:playerNames[3], id:ids[3]});
	return {team_1:team_1, team_2:team_2};
};

croupier.setIdAndNames = function(playerNames){
	var ids = [];
	for(var i = 0; i < 4; i++)
		ids.push(ld.uniqueId());
	return makeTeams(playerNames,ids);
};

croupier.dealCardsToAPlayer = function(dealtCards,player){
	var existingHand = player.hand;
	dealtCards.forEach(function(card){
		existingHand[card.suit].push(card);
	});
	return player;
};
