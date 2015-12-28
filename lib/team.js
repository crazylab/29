var Player = require('./Player');

var Team = function(){
	this.players = [];
	this.score = 0;
	this.wonCards = [];
};

Team.prototype = {
	getCardsCount : function(){
		return this.hand.length;	
	},
 
	addPlayer : function(player ){
		if(this.players.length == 2)
			throw (new Error('not enough space'));
		this.players.push(player);
	},

	getPlayer : function(playerID){
		if(!this.hasPlayer(playerID))
			return;
		var players = this.players.filter(function(player){
			return player.id == playerID;
		});
		return players[0];
	},

	getPartner : function(playerID){
		var players = this.players.filter(function(player){
			return player.id != playerID;
		});
		return players[0]; 
	},

	hasPlayer : function(playerID){
		return this.players.some(function(player){
			return player.id == playerID;
		});
	}
}

module.exports = Team;