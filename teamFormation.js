var teamLib = {};
exports.teamLib = teamLib;

teamLib.Team = function(players){
	this.team1 = {
		player1: new teamLib.Player(players[0]),
		player2: new teamLib.Player(players[2])
	};
	this.team2 = {
		player1: new teamLib.Player(players[1]),
		player2: new teamLib.Player(players[3])
	};
};

teamLib.Player = function(playerName){
	this.name = playerName;
	this.id = playerName;
	this.hand = {
		firstDeal	: [],
		secondDeal	: []
	};
	this.hasPair = false;
};