var ld = require('lodash');
var card = require('./cards.js');
var team = require('./team.js').team;
var croupier = require('./croupier.js').croupier;

var gameExp = {};
gameExp.Game = function(){
	this.deck = card.generateCards(),
	this.distributionSequence = [],
	this.roundSequence = [],
	this.trump = {suit: undefined, open: false},
	this.playedCards = [],
	this.bid = {
		value : undefined, 
		player : {id: undefined}
	},
	this.team_1 = team.generateTeam(),
	this.team_2 = team.generateTeam()	
}
var isTrumpSet = function () {
	if (this.trump.suit) return true;
	return false;
};

gameExp.Game.prototype.getRelationship = function(playerID){
	var relation = {};
	relation.team = this.team_1.hasPlayer(playerID) ? this.team_1 : this.team_2;
	relation.me = relation.team.getPlayer(playerID);
	relation.partner = relation.team.getPartner(playerID);

	relation.opponentTeam = this.team_1.hasPlayer(playerID) ? this.team_2 : this.team_1;
	relation.opponent_1 = relation.opponentTeam.players[0];
	relation.opponent_2 = relation.opponentTeam.players[1];
	return relation;
};

gameExp.Game.prototype.getStatus = function(playerID){		
	var relationship = this.getRelationship(playerID);
	var status = {};
	status.me = relationship.me.getStatus(false);

	status.partner = relationship.partner.getStatus(true);
	status.opponent_1 = relationship.opponent_1.getStatus(true);
	status.opponent_2 = relationship.opponent_2.getStatus(true);
	
	status.bid = this.getFinalBidStatus();
	status.trump = this.trump.open && this.trump.suit;

	var players = ['me','partner','opponent_1','opponent_2'];
	var playedCards = this.playedCards;
	status.playedCards = {};

	players.forEach(function(player){
		status.playedCards[player] = relationship[player].getMyCard(playedCards);
	});
	return status;
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
	this.roundSequence = this.distributionSequence;
	this.roundSequence[3].turn = false;
	this.roundSequence[0].turn = true;
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

gameExp.Game.prototype.setBidWinner = function(value,player){
	this.bid.value = value;
	this.bid.player = player;
};

gameExp.Game.prototype.getFinalBidStatus = function(){
	return this.bid;
};

gameExp.Game.prototype.getPlayer = function(playerID){
	var allPlayer = this.team_1.players.concat(this.team_2.players);
	return allPlayer.filter(function(player){
		return player.id == playerID;
	})[0];
};
gameExp.Game.prototype.setRoundSequence = function(roundWinner){
	var playerIDs = this.roundSequence.map(function(player){
		return player.id;
	});
	var winnerIndex = playerIDs.indexOf(roundWinner);
	var first = this.roundSequence.splice(0,winnerIndex);
	this.roundSequence = this.roundSequence.concat(first);
	this.roundSequence[0].turn = true;
	return this;
}
gameExp.Game.prototype.nextTurn = function(){			//ugly
	if(this.playedCards.length == 4){
		var winner = croupier.roundWinner(this.playedCards,this.trump.suit);
		this.roundSequence[3].turn = false;
		this.setRoundSequence(winner);
		var game = this;
		var roundWinningTeam = this.team_1.hasPlayer(winner) ? 'team_1':'team_2';
		this[roundWinningTeam].wonCards = this[roundWinningTeam].wonCards.concat(this.playedCards);
		setTimeout(function(){
			game.playedCards = [];
		},2500);
		if (this.team_1.wonCards.length + this.team_2.wonCards.length == 32) {
			croupier.updateScore(game);
			this.team_1.wonCards = [];
			this.team_2.wonCards = [];
		};
	}
	else{
		var permissions = this.roundSequence.map(function(player){
			return player.turn;
		});
		var previousPlayerIndex = permissions.indexOf(true);
		this.roundSequence[previousPlayerIndex].turn = false;
		this.roundSequence[previousPlayerIndex+1].turn = true;
	};
}
var hasCardInHand = function(cardId,playerHand){
	return playerHand.some(function(card){
		return card.id == cardId;
	});
}
gameExp.Game.prototype.isValidCardToThrow = function(cardId,playerHand){
	if(this.playedCards.length==0)
		return true;
	var runningSuit = this.playedCards[0].card.id[0];
	var requestedSuit = cardId[0];
	var hasRunningSuit = playerHand.some(function(card){
		return card.id[0] == runningSuit;
	});
	var isCardPresent = hasCardInHand(cardId,playerHand);
	return isCardPresent && hasRunningSuit && (runningSuit == requestedSuit)	//read carefully
			|| isCardPresent && !hasRunningSuit;
};
exports.game = gameExp;