var teamLib = {};
exports.teamLib = teamLib;

teamLib.Team = function(players){
	this.team1 = {};
	this.team2 = {};
};

teamLib.Player = function(){
	this.id = function(){};
	this.firstHand = [];
	this.secondHand = [];
	this.hasPair = false;
};