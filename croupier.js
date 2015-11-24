var deckLib = require('./deck.js').m;
var teamLib = require('./teamFormation.js').team;
var ld = require('lodash');

var croupier = {};
exports.croupier = croupier;

croupier.getShuffledDeck = function(){
	var deck = new deckLib.Deck();
	var shuffledDeck = deck.shuffle(deck.cards);
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

croupier.distributeDeckToEach = function(dealtCards,player){
	var existingHand = player.hand;
	player.hand = existingHand.concat(dealtCards)
	return player;
};
