var ld = require('lodash');

var cardLib = require('./cards.js');
var teamLib = require('./team.js').team;
var gameLib = require('./game.js').game;

var croupier = {};
exports.croupier = croupier;

var shuffle = function(cards){
	cards = ld.shuffle(cards);
	return cards;	
};
croupier.getStatus = function(){

}
croupier.bid = {
	value : null,
	player : null
};
croupier.setBid = function (playerSequence) {
	var self = this;
	var index = 0;
	return function (value) {
		var challenger = index == 1;
		var pass = value == 'pass';
		if(pass){
			ld.pull(playerSequence,playerSequence[index]);
			index = 1 - index;
			return;
		}
		if (self.bid.value >= value && challenger) {
			return Error('Bid should be greater than ',self.bid.value);
		};
		if (value < 16 || value > 28) {
			return Error('Bid should be between 16 & 28');
		}
		self.bid.value = value;
		self.bid.player = playerSequence[index];
		index = 1 - index;
	}
};

croupier.getShuffledDeck = function(){
	var deck = cardLib.generateCards();
	var shuffledDeck = shuffle(deck);
	return shuffledDeck;
};

// croupier.makeTeams = function(uniqueIds){
// 	var team_1 = new teamLib.Team(uniqueIds[0],uniqueIds[2]);
// 	var team_2 = new teamLib.Team(uniqueIds[1],uniqueIds[3]);
// 	return {team_1:team_1, team_2:team_2};
// };

croupier.dealCardsToAPlayer = function(dealtCards,player){
	var existingHand = player.hand;
	dealtCards.forEach(function(card){
		existingHand[card.suit].push(card);
	});
	return player;
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
}

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