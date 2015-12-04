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
	this.hand = {
		Heart : [],
		Spade : [],
		Club : [],
		Diamond : [],
	};
	this.hasPair = false;
};
team.Player.prototype.getCardID = function(){
	var allCards = ld.flattenDeep(ld.values(this.hand));
		return allCards.map(function(card){
			return card.id;
	});	
	return allCards;
}
team.Player.prototype.getCardsCount = function(){
	return this.getCardID().length;
}
team.Team.prototype.getCardsCount = function(){
	return this.hand.length;	
} 
team.generateTeam = function(){
	return new team.Team();
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