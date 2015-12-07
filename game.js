var ld = require('lodash');
var card = require('./cards.js');
var team = require('./team.js').team;
var gameExp = {};
gameExp.Game = function(){
	this.deck = card.generateCards(),
	this.distributionSequence = [],
	this.roundSequence = [],
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
var getMyCard = function(playedCards, id){
	return playedCards.filter(function(playedCard){
		return playedCard.player == id;
	})[0];
}
gameExp.Game.prototype.getStatus = function(playerID){
	var ownTeam = this.team_1.hasPlayer(playerID) ? this.team_1:this.team_2;
	var opponentTeam = this.team_1.hasPlayer(playerID) ? this.team_2:this.team_1;

	var partner = ownTeam.getPartner(playerID);
	var player = ownTeam.getPlayer(playerID);
	return {
		ownHand : player.getCardID(),
		partner : partner.getCardsCount(),
		opponent_1 : opponentTeam.players[0].getCardsCount(),
		opponent_2 : opponentTeam.players[1].getCardsCount(),
		trump : this.trump.open && this.trump.suit,
		playedCards : {
			own: getMyCard(this.playedCards, player.id),
			opponent_2 : getMyCard(this.playedCards, opponentTeam.players[0].id),
			partner: getMyCard(this.playedCards, partner.id),
			opponent_1 : getMyCard(this.playedCards, opponentTeam.players[1].id)
		}
	};
};
gameExp.Game.prototype.shuffle = function(){
	this.deck = ld.shuffle(this.deck);
	return this;	
};	
gameExp.Game.prototype.setDistributionSequence = function(){
	if(this.distributionSequence.length == 0)
		this.distributionSequence = [this.team_1.players[0],this.team_2.players[0],this.team_1.players[1],this.team_2.players[1]];
	else{
		var firstPlayer = this.distributionSequence.splice(0,1)[0];
		this.distributionSequence.push(firstPlayer);
	}
	return this;
};
gameExp.Game.prototype.shuffleDeck = function(){
	this.deck = ld.shuffle(this.deck);
	return this;
};
gameExp.Game.prototype.setTrumpSuit = function (suit) {
	this.trump.suit = suit;
};

gameExp.Game.prototype.getTrumpSuit = function () {
	this.trump.open = true;
	return this.trump.suit;
};
gameExp.Game.prototype.getPlayer = function(playerID){
	var allPlayer = this.team_1.players.concat(this.team_2.players);
	return allPlayer.filter(function(player){
		return player.id == playerID;
	})[0];
};
exports.game = gameExp;
