var croupier = require('./croupier.js').croupier;

var gameHandler = function(uniqueIDs){
	var teams = croupier.makeTeams(uniqueIDs);
};
exports.gameHandler = gameHandler;