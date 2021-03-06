var Player = require('./player.js');
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
		return _.find(this.players, function(player) {
  			return player.id != playerID;
		});
	},

	hasPlayer : function(playerID){
		return this.players.some(function(player){
			return player.id == playerID;
		});
	},

	getTotalTeamPoint : function(){
		return this.players[0].point + this.players[1].point;
	},
	
	resetPlayer : function(){
		this.players.forEach(function(player){
			player.reset();
		});
		return this;
	}
}

module.exports = Team;
