var ld = require('lodash');
var team = {};
exports.team = team;

team.Team = function(){
	this.players = [];
	this.score = 0;
	this.wonCards = [];
};

team.Player = function(id){
	this.id = id;
	this.hand = [];
	this.turn = false,
	this.hasPair = false;
	this.isFinalBidder = false;
};
team.Player.prototype.getCardID = function(){
	return this.hand.map(function(card){
		return card.id;
	});	
};
team.Player.prototype.getCardsCount = function(){
	return this.getCardID().length;
};

team.Player.prototype.removeCard = function(cardId){
	var previousHand = this.hand;
	this.hand = this.hand.filter(function(card){
		return card.id != cardId;
	});
	return ld.difference(previousHand,this.hand)[0];
};

team.Player.prototype.getMyCard = function(playedCards){
	var playerID = this.id;
	return playedCards.filter(function(playedCard){
		return playedCard.player == playerID;
	})[0];
};

team.Player.prototype.getStatus = function(thirdParty){
	var status = {};
	var cardIDs = this.getCardID();
	status.hand = thirdParty ? cardIDs.length : cardIDs;
	status.turn = this.turn;
	status.isBidder = this.isFinalBidder;
	return status;
};

team.Team.prototype.getCardsCount = function(){
	return this.hand.length;	
} 
team.generateTeam = function(){
	return new team.Team();
}

team.Team.prototype.addPlayer = function(player){
	if(this.players.length == 2)
		throw (new Error('not enough space'));
	this.players.push(player);
}

team.Team.prototype.getPlayer = function(playerID){
	if(!this.hasPlayer(playerID)){
		return;
	}
	var players = this.players.filter(function(player){
		return player.id == playerID;
	});
	return players[0];
}
team.Team.prototype.getPartner = function(playerID){
	var players = this.players.filter(function(player){
		return player.id != playerID;
	});
	return players[0]; 
}
team.Team.prototype.hasPlayer = function(playerID){
	return this.players.some(function(player){
		return player.id == playerID;
	});
}