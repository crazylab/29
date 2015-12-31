var _ = require('lodash');
var createDeck = require('./createDeck.js');
var Team = require('./team');
var Player = require('./Player');
var generateCards = require('./generateCards');

// var deck = createDeck(generateCards());
var Game = function(deck){
	this.deck = deck,
	this.distributionSequence = [],
	this.roundSequence = [],
	this.trump = {suit: undefined, open: false},
	this.playedCards = [],
	this.bid = {
		value : 18, 
		player : undefined
	},
	this.team_1 = new Team(),
	this.team_2 = new Team()	
};

var hasCardInHand = function(cardId,playerHand){
	return playerHand.some(function(card){
		return card.id == cardId;
	});
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

Game.prototype = {
	isTrumpSet : function () {
		return this.trump.suit;
	},

	getRelationship : function(playerID){
		var relation = {};
		relation.team = this.team_1.hasPlayer(playerID) ? this.team_1 : this.team_2;
		relation.me = relation.team.getPlayer(playerID);
		relation.partner = relation.team.getPartner(playerID);
		relation.opponentTeam = this.team_1.hasPlayer(playerID) ? this.team_2 : this.team_1;
		relation.opponent_1 = relation.opponentTeam.players[0];
		relation.opponent_2 = relation.opponentTeam.players[1];
		return relation;
	},

	getStatus : function(playerID){		
		var relationship = this.getRelationship(playerID);
		var status = {};
		status.me = relationship.me.getStatus(false);

		status.partner = relationship.partner.getStatus(true);
		status.opponent_1 = relationship.opponent_1.getStatus(true);
		status.opponent_2 = relationship.opponent_2.getStatus(true);
		status.bid = this.getFinalBidStatus();
		var topBidder = this.bid.player == playerID;
		status.isBidWinner = topBidder && !this.isTrumpSet();
		status.trump = this.trump.open && this.trump.suit;

		status.playedCards = {};
		var playedCards = this.playedCards;
		var players = ['me','partner','opponent_1','opponent_2'];
		players.forEach(function(player){
			status.playedCards[player] = relationship[player].getMyCard(playedCards);
		});

		status.score = {myScore: relationship.team.score, opponentScore : relationship.opponentTeam.score};
		status.isDealer = _.first(this.distributionSequence).id == relationship.me.id;
		status.isStart = this.isGameStarting()
		return status;
	},

	isGameStarting : function(){
		return this.team_1.wonCards.length + this.team_2.wonCards.length == 32;
	},

	shuffle : function(){
		this.deck.shuffle();
		return this;	
	},	

	setDistributionSequence : function(){
		if(this.distributionSequence.length == 0)
			this.distributionSequence = [this.team_1.players[0],this.team_2.players[0],this.team_1.players[1],this.team_2.players[1]];
		else{
			var firstPlayer = this.distributionSequence.splice(0,1)[0];
			this.distributionSequence.push(firstPlayer);
		}
		this.roundSequence = this.distributionSequence;
		
		return this;
	},

	pairChecking : function () {
		var trumpSuit = this.trump.suit;
		this.team_1.players.forEach(function(player){
			player.checkPair(trumpSuit);
		});
		this.team_2.players.forEach(function(player){
			player.checkPair(trumpSuit);
		});
	},

	setTrumpSuit : function (suit) {
		this.trump.suit = suit;
		this.distributeCards();
		this.setRoundSequence();
		return this;
	},

	getTrumpSuit : function () {
		this.trump.open = true;
		this.pairChecking();
		return this.trump.suit;
	},

	setBidWinner : function(value,player){
		this.bid.value = value;
		this.bid.player = player.id;
	},

	getFinalBidStatus : function(){
		return this.bid;
	},

	getPlayer : function(playerID){
		var allPlayer = this.team_1.players.concat(this.team_2.players);
		return allPlayer.filter(function(player){
			return player.id == playerID;
		})[0] || false;
	},

	setRoundSequence : function(roundWinner){
		if(roundWinner == undefined){
			this.roundSequence[0].turn = true;
			return this;
		}
		var playerIDs = this.roundSequence.map(function(player){
			return player.id;
		});
		var winnerIndex = playerIDs.indexOf(roundWinner);
		var first = this.roundSequence.splice(0,winnerIndex);
		this.roundSequence = this.roundSequence.concat(first);
		this.roundSequence[0].turn = true;
		return this;
	},

	nextTurn : function(){
		if(this.playedCards.length == 4){
			var winner = this.roundWinner(this.playedCards,this.trump.suit);
			this.roundSequence[3].turn = false;
			this.setRoundSequence(winner);
			var game = this;
			var roundWinningTeam = this.team_1.hasPlayer(winner) ? 'team_1':'team_2';
			this[roundWinningTeam].wonCards = this[roundWinningTeam].wonCards.concat(this.playedCards);
			setTimeout(function(){
				game.playedCards = [];
			},1000);
			if (this.team_1.wonCards.length + this.team_2.wonCards.length == 32) {
				this.updateScore(game);
				this.gameInitializer();
			};
		}
		else{
			var permissions = this.roundSequence.map(function(player){
				return player.turn;
			});
			var previousPlayerIndex = permissions.indexOf(true);
			this.roundSequence[previousPlayerIndex].turn = false;
			this.roundSequence[previousPlayerIndex+1].turn = true;
		};
	},

	gameInitializer : function(){
		var team_1Cards = this.team_1.wonCards.map(function(thrownCard){
			return thrownCard.card;
		});
		var team_2Cards = this.team_2.wonCards.map(function(thrownCard){
			return thrownCard.card;
		});
		this.setDistributionSequence();
		this.deck.recollectCards(team_1Cards, team_2Cards);
		this.trump = {suit: undefined, open: false};
		this.team_1.wonCards = [];
		this.team_2.wonCards = [];
		this.bid = {
			value : 18, 
			player : undefined
		};
	},


	isValidCardToThrow : function(cardId,playerHand){
		if(this.playedCards.length==0)
			return true;
		var runningSuit = this.playedCards[0].card.id[0];
		var requestedSuit = cardId[0];
		var hasRunningSuit = playerHand.some(function(card){
			return card.id[0] == runningSuit;
		});
		var isCardPresent = hasCardInHand(cardId,playerHand);
		return isCardPresent && hasRunningSuit && (runningSuit == requestedSuit)	//read carefully
				|| isCardPresent && !hasRunningSuit;
	},

	playerCount : function(){
		return this.team_1.players.length + this.team_2.players.length;
	},

	addPlayer : function(name){
		if(this.playerCount() == 4)
			return false;
		if(this.playerCount() < 2 )
			this.team_1.addPlayer(new Player(name));
		else
			this.team_2.addPlayer(new Player(name));
		if(this.playerCount() == 4){
			this.setDistributionSequence();
			
		}
		return true;
	},

	distributeCards : function(){
		var sequence = this.distributionSequence;
		console.log(sequence);

		var self = this;
		sequence.forEach(function(player){
			player.hand = player.hand.concat(self.deck.drawFourCards());
		});
		return this;
	},

	ableToAskForTrumpSuit : function(playerHand){
		if(this.playedCards.length == 0)
			return false;
		var runningSuit = this.playedCards[0].card.suit;
		return !playerHand.some(function(card){
			return runningSuit == card.suit;
		});
	},

	roundWinner : function (playedCards,trumpID){
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
	},

	getBidWinnerAndOpponent : function(){
		var bidWinner = this.bid.player;
		var bidWinningTeam = this.team_1.hasPlayer(bidWinner) ? 'team_1':'team_2';
		var opponentTeam = this.team_1.hasPlayer(bidWinner) ? 'team_2':'team_1';
		return {bidWinningTeam: bidWinningTeam, opponentTeam: opponentTeam};
	},

	manipulateBidValueForPair : function () {
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;
		var opponentTeam =  this.getBidWinnerAndOpponent().opponentTeam;

		var hasPairOfBidWinningTeam = this[bidWinningTeam].players.filter(function(player) {
			return player.hasPair == true;
		})[0] != undefined;
		var hasPairOfOpponentTeam = this[opponentTeam].players.filter(function(player) {
			return player.hasPair == true;
		})[0] != undefined;
		if (hasPairOfBidWinningTeam) {
			if (this.bid.value < 21)
				this.bid.value = 16;
			else
				this.bid.value -= 4;
			this[bidWinningTeam].players[0].hasPair = false;
			this[bidWinningTeam].players[1].hasPair = false;

		}
		else if (hasPairOfOpponentTeam) {
			if (this.bid.value > 23)
				this.bid.value = 28;
			else
				this.bid.value += 4;
			this[opponentTeam].players[0].hasPair = false;
			this[opponentTeam].players[1].hasPair = false;
		};
	},
	
	calculateTotalPoint : function(){
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;		
		var teamBucket = this[bidWinningTeam].wonCards;
		return teamBucket.reduce(function(init,secondCard){
			return init + secondCard.card.point;
		},0);
	},

	updateScore : function () {
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;
		var gainPoint = this.calculateTotalPoint();

		this.manipulateBidValueForPair();
		var bidValue = this.bid.value;
		if (bidValue <= gainPoint)
			this[bidWinningTeam].score += 1;
		else
			this[bidWinningTeam].score -= 1;
	}

};

module.exports = Game;