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
};
team.generateTeam = function(){
	return new team.Team();
}

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
team.Player.prototype.checkPair = function (game) {
	var hand = this.hand;
	var suit = game.trump.suit;
	var filteredCards = hand.filter(function(card) {
		return card.suit[0] == suit[0] && (card.name == 'K' || card.name == 'Q');
	});
	if (filteredCards.length == 2)
		this.hasPair = true;
};


team.Team.prototype.getCardsCount = function(){
	return this.hand.length;	
} 
team.Team.prototype.addPlayer = function(player ){
	if(this.players.length == 2)
		throw (new Error('not enough space'));
	this.players.push(player);
}

team.Team.prototype.getPlayer = function(playerID){
	if(!this.hasPlayer)
		return;
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