var _ = require('lodash');

var Player = function(id){
	this.id = id;
	this.hand = [];
	this.turn = false,
	this.hasPair = false;
	this.isFinalBidder = false;
	this._7thCard = false;
	this.point = 0;
};

var getPositionNo = function(card){
	var suitStartNo = {
			'Spade' : 0,
			'Heart' : 9,
			'Club'  : 18,
			'Diamond' : 27
		}
	return suitStartNo[card.suit]+card.rank;
}

Player.prototype = {
	getCardID : function(){
		return this.hand.map(function(card){
			return card.id;
		});
	},

	getCardsCount : function(){
		return this.getCardID().length;
	},

	throwCard : function(cardId){
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
		status._7thCard = this._7thCard;
		status.turn = this.turn;
		status.isBidder = this.isFinalBidder;
		status.point = this.point;
		return status;
	},

	arrangeCards : function(){
		this.hand.sort(function(firstCard,secondCard){
			return getPositionNo(firstCard)>getPositionNo(secondCard);
		});
	},

	get7thCard : function(){
		this._7thCard = _.first(this.hand.splice(6,1));
		return this._7thCard;
	},

	move7thCardToHand : function(){
		this.hand.push(this._7thCard);
		this._7thCard = false;
		this.arrangeCards();
	},

	addPoint : function(point){
		this.point += point;
		return this;
	},

	reset : function(){
		this.turn = false,
		this.hasPair = false;
		this.isFinalBidder = false;
		this._7thCard = false;
		this.point = 0;
		return this;
	}
};


module.exports = Player;
