var team = {};
exports.team = team;

team.Team = function(player_1,player_2){
	this[player_1] = new team.Player();
	this[player_2] = new team.Player();
	this.wonCards = [];
};

team.Player = function(){
	this.hand = {Heart:[],Spade:[],Club:[],Diamond:[]};
	this.hasPair = false;
};
