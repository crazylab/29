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
	getID : function(){
		return this.id;
	},

	setTurn : function(){
		this.turn = true;
	},

	revokeTurn : function(){
		this.turn = false;
	},

	hasTurn : function(){
		return this.turn;
	},

	getCardIDs : function(){
		return this.hand.map(function(card){
			return card.id;
		});
	},

	getCardsCount : function(){
		return this.getCardIDs().length;
	},

	throwCard : function(cardId){
		var previousHand = this.hand;
		this.hand = this.hand.filter(function(card){
			return card.id != cardId;
		});
		var thrownCard = _.difference(previousHand,this.hand)[0];
		// this.revokeTurn();
		if(this._7thCard && this.hand.length == 0)
			this.move7thCardToHand();

		return thrownCard;
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
		var cardIDs = this.getCardIDs();
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
		this.hand = [];
		this.turn = false;
		this.hasPair = false;
		this.isFinalBidder = false;
		this._7thCard = false;
		this.point = 0;
		return this;
	},

	hasCard : function(cardID){
		return this.hand.some(function(card){
			return card.id == cardID;
		});
	},

	hasSameSuitCard : function(cardID){
		var suit = cardID[0];
		return this.hand.some(function(card){
			return card.suit[0] == suit;
		});
	},

	getCardIDsOf : function(suit){
		for(var index = 0; index < this.hand.length; index++){
			var card = this.hand[index];
			if(card.isOfSuit(suit))
				return card.getID();
		}
		return false;
	},

	getFirstCardID : function(){
		var firstCardInHand = _.first(this.hand);
		return firstCardInHand.getID();
	},

	getAThrowableCardID : function(playedCards){
		if(this.hand.length == 0)
			return null;
		if(playedCards.isStartOfRound())
			return this.getFirstCardID();

		var runningSuit = playedCards.getRunningSuit();
		var throwableCardID = this.getCardIDsOf(runningSuit);

		return throwableCardID ? throwableCardID : this.getFirstCardID();
	}
};

module.exports = Player;
