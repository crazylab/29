var Player = require('./Player');
var _ = require('lodash');

var Team = function(){
	this.players = [];
	this.score = 0;
	this.wonCards = [];
};

Team.prototype = {
	addPlayer : function(player ){
		if(this.players.length == 2)
			throw (new Error('not enough space'));
		this.players.push(player);
	},

	getPlayer : function(playerID){
		return _.find(this.players, function(player) {
  			return player.id === playerID;
		});
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