var ld = require('lodash');
var card = require('./cards.js');
var team = require('./team.js').team;
var gameExp = {};
gameExp.Game = function(){
	this.deck = card.generateCards(),
	this.trump = {suit: null, open: false},
	this.playedCards = [],
	this.bid = {value : null, player : null},
	this.team_1 = team.generateTeam(),
	this.team_2 = team.generateTeam()	
}
var isTrumpSet = function () {
	if (this.trump.suit) return true;
	return false;
};
gameExp.Game.prototype.getStatus = function(playerID){
	var ownTeam = this.team_1.hasPlayer(playerID) ? this.team_1:this.team_2;
	var opponentTeam = this.team_1.hasPlayer(playerID) ? this.team_2:this.team_1;

	var partner = ownTeam.getPartner(playerID);
	var player = ownTeam.getPlayer(playerID);
	return {
		ownHand : player.getCardID(),
		partner : partner.getCardsCount(),
		opponent_1 : opponentTeam.players[0].getCardsCount(),//opponent.player[0].hand.num_of_cards();
		opponent_2 : opponentTeam.players[1].getCardsCount(),
		trumpStatus : this.trump.open
	};
};

gameExp.Game.prototype.assignTeam = function(playerIDs){
	this.team_1.addPlayer(new team.Player(playerIDs[0]));
	this.team_1.addPlayer(new team.Player(playerIDs[1]));
	this.team_2.addPlayer(new team.Player(playerIDs[2]));
	this.team_2.addPlayer(new team.Player(playerIDs[3]));
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
gameExp.Game.prototype.shuffle = function(){
	this.deck = ld.shuffle(this.deck);
	return this;	
};

gameExp.Game.prototype.distributeCards = function(){
	var self = this;
	this.team_1.players.forEach(function(player){
		var dealtCards = self.deck.splice(0,4);
		player.hand = seperateCards(dealtCards);
	});
	this.team_2.players.forEach(function(player){
		var dealtCards = self.deck.splice(0,4);
		player.hand = seperateCards(dealtCards);
	});
	return this;
};
gameExp.Game.prototype.setTrumpSuit = function (suit) {
	this.trump.suit = suit;
};

gameExp.Game.getTrumpSuit = function () {
	this.trump.open = true;
	return this.trump.suit;
};
exports.game = gameExp;