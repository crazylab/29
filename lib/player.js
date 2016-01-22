var _ = require('lodash');

var Player = function(id){
	this.id = id;
	this.hand = [];
	this.turn = false,
	this.hasPair = false;
	this.isFinalBidder = false;
};

Player.prototype = {
	getCardID : function(){
		return this.hand.map(function(card){
			return card.id;
		});
	},

	getCardsCount : function(){
		return this.getCardID().length;
	},

	removeCard : function(cardId){
		var previousHand = this.hand;
		this.hand = this.hand.filter(function(card){
			return card.id != cardId;
		});
		return _.difference(previousHand,this.hand)[0];
	},

	checkPair : function (trumpSuit) {
		var hand = this.hand;
		var suit = trumpSuit;
		var filteredCards = hand.filter(function(card) {
			return card.suit[0] == suit[0] && (card.name == 'K' || card.name == 'Q');
		});
		if (filteredCards.length == 2)
			this.hasPair = true;
	},

	getMyCard : function(playedCards){
		var playerID = this.id;
		return _.find(playedCards, function(eachPlayedCard){
			return eachPlayedCard.player == playerID;
		});
	},

	getStatus : function(isThirdParty){
		var status = {};
		var cardIDs = this.getCardID();
		status.hand = isThirdParty ? cardIDs.length : this.hand;
		status.turn = this.turn;
		status.isBidder = this.isFinalBidder;
		return status;
	},

	arrangeCards : function(){
		var sortedCards = {
			Spade : [],
			Heart : [],
			Club : [],
			Diamond : []
		};
		this.hand.forEach(function(card){
			sortedCards[card.suit].push(card);
		});
		_.forIn(sortedCards, function(cards, suit){
			sortedCards[suit] = arrangeByPriority(cards);
		});
		this.hand = sortedCards.Spade.concat(sortedCards.Heart, sortedCards.Club, sortedCards.Diamond);
		return this;
	}
};

var arrangeByPriority = function(cards){
	var cardHolder;
	for(var index = 0; index < cards.length - 1; index++){
		if(cards[index].rank > cards[index+1].rank){
			cardHolder = cards[index];
			cards[index] = cards[index+1];
			cards[index+1] = cardHolder;
		}
	};
	return cards;
};

module.exports = Player;
