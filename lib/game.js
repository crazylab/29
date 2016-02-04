var _ = require('lodash');
var createDeck = require('./createDeck.js');
var Team = require('./team.js');
var Player = require('./player.js');
var generateCards = require('./generateCards');

var Game = function(deck){
	this.id = _.uniqueId();
	this.deck = deck;
	this.distributionSequence = [];
	this.roundSequence = [];
	this.trump = {suit: undefined, open: false};
	this.playedCards = [];
	this.bid = {
		value : 0,
		player : undefined,
		turn : {
			leading: undefined,
			lagging : undefined
		},
		passed : []
	};
	this.team_1 = new Team();
	this.team_2 = new Team();
	this.end = true;
};

var hasCardInHand = function(cardId,playerHand){
	return playerHand.some(function(card){
		return card.id == cardId;
	});
};

var hasSuitInHand = function(cardId,playerHand){
	return playerHand.some(function(card){
		return card.id[0] == cardId;
	});
};

var beforeTrumpShow = function(comparingCard,startingSuit,standCard){
	if (startingSuit == comparingCard.card.suit[0]) {
		if (standCard.card.rank > comparingCard.card.rank)
			standCard = comparingCard;
	};
	return standCard;
};

var calculatePoint = function(cards){
	return cards.reduce(function(init,secondCard){
			return init + secondCard.card.point;
		},0);
}

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
	getRelationship : function(playerID){
		var relation = {};
		relation.team = this.team_1.hasPlayer(playerID) ? this.team_1 : this.team_2;
		relation.me = relation.team.getPlayer(playerID);
		relation.partner = relation.team.getPartner(playerID);
		relation.opponentTeam = this.team_1.hasPlayer(playerID) ? this.team_2 : this.team_1;
		relation.opponent_1 = this.getNextPlayer(relation.me.id);
		relation.opponent_2 = this.getNextPlayer(relation.partner.id);
		return relation;
	},

	setPermissionToSeeHandCards : function(relationship){
		var status = {};
		status.me = relationship.me.getStatus(false);

		status.partner = relationship.partner.getStatus(true);
		status.opponent_1 = relationship.opponent_1.getStatus(true);
		status.opponent_2 = relationship.opponent_2.getStatus(true);
		return status;
	},

	getStatus : function(playerID){
		var relationship = this.getRelationship(playerID);
		var status = this.setPermissionToSeeHandCards(relationship);

		status.bid = this.getFinalBidStatus(playerID);
		var topBidder = this.bid.player == playerID;
		status.isBidWinner = topBidder && !this.trump.suit && this.bid.passed.length==3;
		status.trump = this.trump.open && this.trump.suit;
		status.isTrumpSet = Boolean(this.trump.suit);
		status.playedCards = this.getPlayedCards(playerID);

		status.score = {myScore: relationship.team.score, opponentScore : relationship.opponentTeam.score};
		status.point = {myTeamPoint : relationship.team.point, opponentTeamPoint : relationship.opponentTeam.point};
		status.isDealComplete = this.isDealDone();
		status.isStart = this.isGameStarting();
		status.end = this.end;
		status.isCurrentBidder = this.getCurrentBidder()==playerID;
		status.pair = this.getRoyalPairStatus(playerID);
		return status;
	},

	getRoyalPairStatus : function(playerID){
		if(this.isJustNowTrumpRevel()){
			this.pairChecking();
			var team_1Player = this.team_1.players.filter(function(player){
				return player.hasPair == true;
			});
			var team_2Player = this.team_2.players.filter(function(player){
				return player.hasPair == true;
			});
			var player = team_1Player.concat(team_2Player);
			return player[0] ? this.whoAreYou(player[0].id,playerID) : false;
		}
	},

	isGameOver : function(){
		return this.team_1.point == 6 || this.team_1.point == -6 || this.team_2.point == 6 ||this.team_2.point == -6;
	},

	setBidderTurn : function(){
		this.bid.turn = {
			leading : _.first(this.distributionSequence).id,
			lagging : this.distributionSequence[1].id
		};
	},

	getCurrentBidder : function(){
		if(this.bid.player == this.bid.turn.leading)
			return this.bid.turn.lagging;
		return this.bid.turn.leading;
	},

	isGameStarting : function(){
		return this.team_1.wonCards.length + this.team_2.wonCards.length == 32;
	},

	setDistributionSequence : function(){
		if(this.distributionSequence.length == 0)
			this.distributionSequence = [this.team_1.players[0],this.team_2.players[0],this.team_1.players[1],this.team_2.players[1]];
		else{
			var firstPlayer = _.first(this.distributionSequence);
			var remainingPlayers = _.drop(this.distributionSequence);
			remainingPlayers.push(firstPlayer);
			this.distributionSequence = remainingPlayers;
		}
		this.roundSequence = this.distributionSequence;
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

	setTrumpSuit : function (cardID, playerID) {
		if(cardID == 'seventh'){
			var player = this.getPlayer(playerID);
			var _7thCard = player.get7thCard();
			cardID = _7thCard.suit[0] + '2';
		}
		this.trump.suit = cardID;
		this.distributeCards();
		this.setRoundSequence();
	},

	getTrumpSuit : function () {
		this.trump.open = true;
		this.pairChecking();
		this.manipulateBidValueForPair();
		return this.trump.suit;
	},

	setBidWinner : function(value,player){
		this.bid.value = value;
		this.bid.player = player.id;
	},

	getFinalBidStatus : function(playerID){
		var bid = {};
		bid.value = this.bid.value;
		bid.player = this.whoAreYou(this.bid.player, playerID);
		return bid;
	},

	getPlayer : function(playerID){
		var allPlayer = this.team_1.players.concat(this.team_2.players);
		return allPlayer.filter(function(player){
			return player.id == playerID;
		})[0] || false;
	},

	setRoundSequence : function(roundWinner){
		if(roundWinner == undefined)
			_.first(this.roundSequence).turn = true;
		var playerIDs = this.roundSequence.map(function(player){
			return player.id;
		});
		var winnerIndex = playerIDs.indexOf(roundWinner);
		var first = this.roundSequence.splice(0,winnerIndex);
		this.roundSequence = this.roundSequence.concat(first);
		_.first(this.roundSequence).turn = true;
	},

	isGameFinished : function(){
		return this.team_1.wonCards.length + this.team_2.wonCards.length == 32;
	},

	storeWonCards : function(winner){
		var roundWinningTeam = this.team_1.hasPlayer(winner) ? 'team_1':'team_2';
		this[roundWinningTeam].wonCards = this[roundWinningTeam].wonCards.concat(this.playedCards);
	},

	startNewRound : function(){
		var winner = this.roundWinner();
		_.last(this.roundSequence).turn = false;
		this.setRoundSequence(winner);
		var game = this;
		this.storeWonCards(winner);

		setTimeout(function(){
			game.playedCards = [];
		},1500);
	},

	setAllPlayersTurnFalse : function(){
		this.team_1.players.forEach(function(eachPlayer){
			eachPlayer.turn = false;
		});
		this.team_2.players.forEach(function(eachPlayer){
			eachPlayer.turn = false;
		});
	},

	setTeamPoint : function(){
		this.team_1.point = calculatePoint(this.team_1.wonCards);
		this.team_2.point = calculatePoint(this.team_2.wonCards);
	},

	handleCompletionOfRound : function(){
		this.startNewRound();
		this.setTeamPoint();

		if (this.isGameFinished()) {
			this.setAllPlayersTurnFalse();
			this.updateScore();
			this.gameInitializer();
		}
	},

	rotateTurn : function(){
		var permissions = this.roundSequence.map(function(player){
			return player.turn;
		});
		var previousPlayerIndex = permissions.indexOf(true);
		this.roundSequence[previousPlayerIndex].turn = false;
		this.roundSequence[previousPlayerIndex+1].turn = true;
	},

	nextTurn : function(){
		if(this.playedCards.length == 4)
			this.handleCompletionOfRound();
		else
			this.rotateTurn();
	},

	getAllCardsFromTeams : function(){
		var team_1Cards = this.team_1.wonCards.map(function(thrownCard){
			return thrownCard.card;
		});
		var team_2Cards = this.team_2.wonCards.map(function(thrownCard){
			return thrownCard.card;
		});
		this.team_1.wonCards = this.team_2.wonCards = [];
		return{ team_1:team_1Cards, team_2:team_2Cards };
	},

	gameInitializer : function(){
		var takenCards = this.getAllCardsFromTeams();
		this.setDistributionSequence();
		this.deck.recollectCards(takenCards.team_1, takenCards.team_2);
		this.trump = {suit: undefined, open: false};

		this.bid.value = 0;
		this.bid.player = undefined;
		this.bid.passed = [];
	},

	isJustNowTrumpRevel : function(){
		return this.playedCards.length>0 && _.last(this.playedCards).trumpShown==false && this.trump.open==true;
	},

	isValidCardToPlayAfterAskForTrumpSuit : function(playerHand,requestedSuit){
		var hasTrumpColor = hasSuitInHand(this.trump.suit[0],playerHand);
		if(hasTrumpColor)
			return this.trump.suit[0] == requestedSuit;
		return true;
	},

	isValidCardToThrow : function(cardId,playerHand){
		if(this.playedCards.length==0) return true;
		var runningSuit = this.playedCards[0].card.id[0];
		var requestedSuit = cardId[0];
		var hasRunningSuit = hasSuitInHand(runningSuit,playerHand);

		if(this.isJustNowTrumpRevel())
			return this.isValidCardToPlayAfterAskForTrumpSuit(playerHand,requestedSuit);

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

		var self = this;
		sequence.forEach(function(player){
			player.hand = player.hand.concat(self.deck.drawFourCards());
			player.arrangeCards();
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

	roundWinner : function (){
		var playedCards = this.playedCards;
		var trumpID = this.trump.suit;
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

	whichTeamPlayerHasPair : function(){
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;
		var opponentTeam =  this.getBidWinnerAndOpponent().opponentTeam;

		var playerGetPairOfBidWinningTeam = this[bidWinningTeam].players.filter(function(player) {
			return player.hasPair == true;
		})[0];
		var playerGetPairOfOpponentTeam = this[opponentTeam].players.filter(function(player) {
			return player.hasPair == true;
		})[0];

		return { bidWinningTeam : playerGetPairOfBidWinningTeam, opponentTeam : playerGetPairOfOpponentTeam};
	},

	reduceBidValue : function(player){
		if (this.bid.value < 21)
			this.bid.value = 16;
		else
			this.bid.value = +(this.bid.value) - 4;
		player.hasPair = false;
	},

	deduceBidValue : function(player){
		if (this.bid.value > 23)
			this.bid.value = 28;
		else
			this.bid.value = +(this.bid.value) + 4;
		player.hasPair = false;
	},

	manipulateBidValueForPair : function () {
		var playerGotPair = this.whichTeamPlayerHasPair();

		if (playerGotPair.bidWinningTeam)
			this.reduceBidValue(playerGotPair.bidWinningTeam);
		else if (playerGotPair.opponentTeam)
			this.deduceBidValue(playerGotPair.opponentTeam);
	},

	calculateTotalPointOfBidWinningTeam : function(){
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;
		var teamBucket = this[bidWinningTeam].wonCards;
		return teamBucket.reduce(function(init,secondCard){
			return init + secondCard.card.point;
		},0);
	},

	isNoPit : function(team_name){
		return this[team_name].wonCards.length == 32;
	},

	updateScore : function () {
		if(this.trump.open == false) return;
		var bidWinningTeam = this.getBidWinnerAndOpponent().bidWinningTeam;
		var gainPoint = this.calculateTotalPointOfBidWinningTeam();

		var bidValue = this.bid.value;
		if(this.isNoPit(bidWinningTeam))
			this[bidWinningTeam].score +=2;
		else if (bidValue <= gainPoint)
			this[bidWinningTeam].score += 1;
		else
			this[bidWinningTeam].score -= 1;
	},

	setBidTurnPropertiesUndefined : function(){
		this.bid.turn = {
				leading: undefined,
				lagging : undefined
			};
	},

	chanceToNextPlayer : function(){
		if(this.bid.turn.leading == this.getCurrentBidder())
			this.bid.turn.leading = this.bid.turn.lagging;
		this.bid.turn.lagging = this.distributionSequence[this.bid.passed.length+1].id;
	},

	giveTurnToAnotherForBidding : function(){
		this.bid.passed.push(this.getCurrentBidder());
		if(this.bid.passed.length == 3){
			if(this.bid.value == 0) {
				this.bid.value = 16;
				this.bid.player = _.last(this.distributionSequence).id;
			}
			this.setBidTurnPropertiesUndefined();
		}
		else
			this.chanceToNextPlayer();
	},

	updateBidValueAndPlayer : function(value,playerID){
		if(playerID == this.bid.turn.leading){
			this.bid.value = value;
			this.bid.player = this.bid.turn.leading;
		}
		else{
			if(value == this.bid.value) return;
			this.bid.value = value;
			this.bid.player = this.bid.turn.lagging;
		}
	},

	setBid : function(playerID, value){
		if(value == 'Pass')
			this.giveTurnToAnotherForBidding();
		else if(value < this.bid.value || value < 16 || value > 29 || isNaN(value))
			return;
		else
			this.updateBidValueAndPlayer(value,playerID);

	},

	getBid : function(){
		return this.bid;
	},

	getPlayedCards : function(playerID){
		var self = this;
		var playedCards = this.playedCards.map(function(played_card){
			var result = {
				card : played_card.card,
				relation : self.whoAreYou(played_card.player, playerID)
			};
			return result;
		});
		return playedCards;
	},

	whoAreYou : function(playerID_to, playerID_me){
		var relation = this.getRelationship(playerID_me);
		switch (playerID_to) {
           case relation.me.id : return 'you';
           case relation.partner.id : return 'partner';
           case relation.opponent_1.id : return 'right';
           case relation.opponent_2.id : return 'left';
           default: return null;
       }
	},

	isDealDone : function(){
		return this.deck.cardsCount() <= 16;
	},
	getNextPlayer : function(playerID){
		var currentPlayerIndex = 0;
		this.distributionSequence.forEach(function(player, i){
			if(player.id == playerID)
				currentPlayerIndex = i;
		});
		if(currentPlayerIndex == 3)
			return this.distributionSequence[0];
		return this.distributionSequence[currentPlayerIndex + 1];
	},

	getID : function () {
		return this.id;
	}
};

module.exports = Game;
