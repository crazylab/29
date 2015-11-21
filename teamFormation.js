var teamLib = {};
exports.teamLib = teamLib;

teamLib.Team = function(players){
	this.team1 = {
		player1:players[0],
		player2:players[2]
	};
	this.team2 = {
		player1:players[1],
		player2:players[3]
	};
};

teamLib.Player = function(){
	this.id = function(){};
	this.firstHand = [];
	this.secondHand = [];
	this.hasPair = false;
};