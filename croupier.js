var ld = require('lodash');

var cardLib = require('./cards.js');
var teamLib = require('./team.js').team;
var gameLib = require('./game.js').game;

var croupier = {};
exports.croupier = croupier;

croupier.distributeCards = function(game){
	var sequence = game.distributionSequence;
	sequence.forEach(function(player){
		player.hand = player.hand.concat(game.deck.splice(0,4));
	});
	return game;
};

croupier.calculateTotalPoint = function(teamBucket){
	return teamBucket.reduce(function(init,secondCard){
		return init + secondCard.card.point;
	},0);
};

var beforeTrumpShow = function(comparingCard,startingSuit,standCard){
	if (startingSuit == comparingCard.card.suit[0]) {
		if (standCard.card.rank > comparingCard.card.rank)
			standCard = comparingCard;
	};
	return standCard;
};

var afterTrumpShow = function(comparingCard,startingSuit,standCard,trumpSuit){
	if (comparingCard.card.suit[0] == trumpSuit && standCard.trumpShown==false)
		standCard = comparingCard;
	else if(comparingCard.card.suit[0] == trumpSuit && standCard.trumpShown==true){
		if(standCard.card.suit[0] != trumpSuit)
			standCard = comparingCard;
		if(standCard.card.rank > comparingCard.card.rank && standCard.card.suit[0] == trumpSuit)
			standCard = comparingCard;
	}
	else if(comparingCard.card.suit[0] != trumpSuit && standCard.card.suit[0] != trumpSuit)
		standCard = beforeTrumpShow(comparingCard,startingSuit,standCard);
	return standCard;
};

croupier.roundWinner = function (playedCards,trumpID){
	var trumpSuit = trumpID && trumpID[0];
	var startingSuit = playedCards[0].card.suit[0];
	var standCard = playedCards[0];
	for (var i = 1;i < playedCards.length;i++){
		if (playedCards[i].trumpShown == false || startingSuit == trumpSuit)
			standCard = beforeTrumpShow(playedCards[i],startingSuit,standCard)
		else
			standCard = afterTrumpShow(playedCards[i],startingSuit,standCard,trumpSuit);
	};
	return standCard.player;
};

croupier.countPlayer = function(game){
	return game.team_1.players.length + game.team_2.players.length;
};

croupier.assignPlayer = function(game,player){
	if(croupier.countPlayer(game) < 2 )
		game.team_1.addPlayer(player);
	else
		game.team_2.addPlayer(player);
	return game;
};

croupier.manipulateBidValueForPair = function (game,bidWinningTeam, opponentTeam) {
	var hasPairOfBidWinningTeam = game[bidWinningTeam].players.filter(function(player) {
		return player.hasPair == true;
	})[0] != undefined;
	var hasPairOfOpponentTeam = game[opponentTeam].players.filter(function(player) {
		return player.hasPair == true;
	})[0] != undefined;
	if (hasPairOfBidWinningTeam) {
		if (game.bid.value < 21)
			game.bid.value = 16;
		else
			game.bid.value -= 4;
		game[bidWinningTeam].players[0].hasPair = false;
		game[bidWinningTeam].players[1].hasPair = false;

	}
	else if (hasPairOfOpponentTeam) {
		if (game.bid.value > 23)
			game.bid.value = 28;
		else
			game.bid.value += 4;
		game[opponentTeam].players[0].hasPair = false;
		game[opponentTeam].players[1].hasPair = false;
	};
};

croupier.updateScore = function (game) {
	var bidWinner = game.bid.player.id;
	var bidWinningTeam = game.team_1.hasPlayer(bidWinner) ? 'team_1':'team_2';
	var opponentTeam = game.team_1.hasPlayer(bidWinner) ? 'team_2':'team_1';
	var gainPoint = croupier.calculateTotalPoint(game[bidWinningTeam].wonCards);
	croupier.manipulateBidValueForPair(game,bidWinningTeam,opponentTeam);
	var bidValue = game.bid.value;
	if (bidValue <= gainPoint)
		game[bidWinningTeam].score += 1;
	else
		game[bidWinningTeam].score -= 1;
	return game;
};
croupier.pairChecking = function (game) {
	game.team_1.players.forEach(function(player){
		player.checkPair(game);
	});
	game.team_2.players.forEach(function(player){
		player.checkPair(game);
	});
};

croupier.ableToAskForTrumpSuit = function(playerHand,playedCards){
	if(playedCards.length == 0)
		return false;
	// console.log(playerHand©)
	var runningSuit = playedCards[0].card.suit;
	return !playerHand.some(function(card){
		return runningSuit == card.suit;
	});
};