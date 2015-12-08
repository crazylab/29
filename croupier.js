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
		return init + secondCard.point;
	},0);
};

var beforeTrumpShow = function(comparingCard,startingSuit,standCard){
	if (startingSuit == comparingCard.card.suit) {
		if (standCard.card.rank > comparingCard.card.rank)
			standCard = comparingCard;
	};
	return standCard;
};

var afterTrumpShow = function(comparingCard,startingSuit,standCard,trumpSuit){
	if (comparingCard.card.suit == trumpSuit && standCard.trumpShown==false)
		standCard = comparingCard;
	else if(comparingCard.card.suit == trumpSuit && standCard.trumpShown==true){
		if(standCard.card.rank > comparingCard.card.rank)
			standCard = comparingCard;
	}
	else if(comparingCard.card.suit != trumpSuit && standCard.card.suit != trumpSuit)
		standCard = beforeTrumpShow(comparingCard,startingSuit,standCard);
	return standCard;
};

croupier.roundWinner = function (playedCards,trumpSuit){
	var startingSuit = playedCards[0].card.suit;
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