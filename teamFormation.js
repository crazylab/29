var teamLib = {};
exports.teamLib = teamLib;

teamLib.Team = function(players){
	this.team1 = {};
	this.team2 = {};
};

teamLib.Player = function(player){
	this.id = function(){};
	this.hand = {};
	this.hasPair = false;
};