var ld = require('lodash');
var card = require('./cardGenerator.js');

var game = {
	deck: card.generateCards(),
	sequence : null,
	trump : {suit: null, open: false},
	playedCards : [],
	bid : {value : null, player : null},
	score : {team_1 : 0, team_2 : 0}
};
var getCardID = function(cards){
	var allCards = ld.flattenDeep(ld.values(cards));
	return allCards.map(function(card){
		return card.id;
	});
};
var isTrumpSet = function () {
	if (this.trump.suit) return true;
	return false;
};
game.getStatus = function(playerID){
	var ownTeam = game.sequence.filter(function(id){
		return game[playerID].team == game[id].team;
	});
	var opponentTeam = ld.difference(game.sequence,ownTeam);
	return {
		ownHand : getCardID(game[playerID].hand),
		partner : getCardID(game[ownTeam[0]].hand).length,
		opponent_1 : getCardID(game[opponentTeam[0]].hand).length,
		opponent_2 : getCardID(game[opponentTeam[1]].hand).length,
		trumpStatus : game.trump
	};
};
var Player = function(team){
	this.team = team;
	this.hand = {Heart:[],Spade:[],Club:[],Diamond:[]};
	this.hasPair = false;
};
game.assignTeam = function(playerIDs){
	game.sequence = ld.shuffle(playerIDs);
	var teams = ['team_1','team_2'];
	var index = 0;
	game.sequence.forEach(function(id){
		game[id] = new Player(teams[index]);
		index = 1 - index;
	});
	return game;
};
var seperateCards = function(cards){
	var allCards = {
					'Heart' : [],
					'Spade' : [],
					'Club' : [],
					'Diamond' : []
				};
	cards.forEach(function(card){
		allCards[card.suit].push(card);
	});
	return allCards;
}
game.shuffle = function(){
	game.deck = ld.shuffle(game.deck);
	return game;	
};
game.distributeCards = function(){
	game.sequence.forEach(function(id){
		var dealtCards = game.deck.splice(0,4);
		game[id].hand = seperateCards(dealtCards);
	});
	return game;
};
game.setTrumpSuit = function (suit) {
	this.trump.suit = suit;
};

game.getTrumpSuit = function () {
	this.trump.open = true;
	return this.trump.suit;
};
exports.game = game;
