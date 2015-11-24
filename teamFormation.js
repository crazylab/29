var team = {};
exports.team = team;

team.Team = function(player_1,player_2){
	this.player_1 = new team.Player(player_1.name, player_1.id);
	this.player_2 = new team.Player(player_2.name, player_2.id);
};

team.Player = function(playerName,id){
	this.name = playerName;
	this.id = id;
	this.hand = [];
	this.hasPair = false;
};
