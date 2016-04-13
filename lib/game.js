var _ = require('lodash');
var Team = require('./team.js');
var Player = require('./player.js');
var generateCards = require('./generateCards');
var ThrownCardStatus = require('./thrownCardStatus');

var Game = function(deck){
	this.id = _.uniqueId();
	this.deck = deck;
	this.distributionSequence = [];
	this.roundSequence = [];
	this.trump = {suit: undefined, open: false, _7thCardPlayerPlayer: false};
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
	this.lastActivityTime = new Date();
};

var beforeTrumpShow = function(comparingCard,startingSuit,standCard){
	if (startingSuit == comparingCard.getCardSuit()) {
		if (standCard.getCard().rank > comparingCard.getCard().rank)
			standCard = comparingCard;
	};
	return standCard;
};

var calculatePoint = function(cards){
	return cards.reduce(function(init,secondCard){
			return init + secondCard.getCard().point;
		},0);
}

var calculatePointOfFristPlayer = function(cards){
	return cards.reduce(function(init,secondCard){
			return init + secondCard.point;
		},0);
}

var afterTrumpShow = function(comparingCard,startingSuit,standCard,trumpSuit){
	if (comparingCard.getCardSuit() == trumpSuit && !standCard.isTrumpShown())
		standCard = comparingCard;
	else if(comparingCard.getCardSuit() == trumpSuit && standCard.isTrumpShown()){
		if(standCard.getCardSuit() != trumpSuit)
			standCard = comparingCard;
		if(standCard.getCard().rank > comparingCard.getCard().rank && standCard.getCardSuit() == trumpSuit)
			standCard = comparingCard;
	}
	else if(comparingCard.getCardSuit() != trumpSuit && standCard.getCardSuit() != trumpSuit)
		standCard = beforeTrumpShow(comparingCard,startingSuit,standCard);
	return standCard;
};

var isJack = function(card){
	return card.name == 'J';
}

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
			var _7thCard = this.distributeCards(true, playerID);
			cardID = _7thCard.suit[0] + '2';
			this.trump['_7thCardPlayer'] = this.getPlayer(playerID);
		}
		else {
			this.distributeCards();
		}
		this.trump.suit = cardID;
		if(this.checkAllPlayerHand())
			this.setRoundSequence();
	},

	getTrumpSuit : function () {
		if(this.trump._7thCardPlayer){
			this.trump._7thCardPlayer.move7thCardToHand();
		}
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
		bid.threshold = this.getBidThreshold(playerID);
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

	handleCompletionOfRound : function(){
		this.startNewRound();

		if (this.isGameFinished()) {
			this.updateScore();
			this.resetGameVariables();
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
		this.updateActivityTime();
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

	resetBidAndTrump : function(){
		this.trump = {suit: undefined, open: false};
		this.bid.value = 0;
		this.bid.player = undefined;
	},

	resetGameVariables : function(){
		var takenCards = this.getAllCardsFromTeams();
		this.deck.recollectCards(takenCards.team_1, takenCards.team_2);
		this.resetBidAndTrump();
	},

	gameInitializer : function(){
		this.bid.passed = [];
		this.team_1.resetPlayer();
		this.team_2.resetPlayer();
		this.setDistributionSequence();
		this.setBidTurnPropertiesUndefined();
	},

	isJustNowTrumpRevel : function(){
		return this.playedCards.length>0 && !_.last(this.playedCards).isTrumpShown() && this.trump.open==true;
	},

	isValidCardToPlayAfterAskForTrumpSuit : function(player,requestedSuit){
		var hasTrumpColor = player.hasSameSuitCard(this.trump.suit);
		if(hasTrumpColor)
			return this.trump.suit[0] == requestedSuit;
		return true;
	},

	isValidCardToThrow : function(cardID, player){
		if(this.playedCards.length==0) return true;
		var startingCard = this.playedCards[0].getCardID();
		var runningSuit = startingCard[0];
		var requestedSuit = cardID[0];
		var hasRunningSuit = player.hasSameSuitCard(startingCard);

		if(this.isJustNowTrumpRevel())
			return this.isValidCardToPlayAfterAskForTrumpSuit(player,requestedSuit);

		var isCardPresent = player.hasCard(cardID);
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
		if(this.playerCount() == 4)
			this.setDistributionSequence();
		return true;
	},

	distributeCards : function(is7thCard, playerID){
		var sequence = this.distributionSequence;
		var self = this;
		var _7thCard;
		sequence.forEach(function(player){
			player.hand = player.hand.concat(self.deck.drawFourCards());
			if(player.id == playerID){
				_7thCard = player.get7thCard();
			}
			player.arrangeCards();
		});
		return _7thCard;
	},

	hasFirstPlayerGetAPoint : function(){
		if(calculatePointOfFristPlayer(_.first(this.distributionSequence).hand)>0) return true;
		else{
			var allCards = [];
			for(var index = 0; index<this.distributionSequence.length; index++){
				allCards = allCards.concat(this.distributionSequence[index].hand);
				this.distributionSequence[index].hand = [];
			}
			this.deck.recollectCards(this.deck.getCards(),allCards);
			return false;
		}
	},

	hasFourJackInAHand : function(){
		for(var playerIndex=0; playerIndex<this.distributionSequence.length; playerIndex++){
			var cardsOfJack = this.distributionSequence[playerIndex].hand.filter(isJack);
			if(cardsOfJack.length>0&&cardsOfJack.length<4) return false;
		}
		return true;
	},

	initializeGameAfterCancelation : function(){
		this.resetBidAndTrump();
		var team_1Cards = this.team_1.players[0].hand.concat(this.team_1.players[1].hand);
		var team_2Cards = this.team_2.players[0].hand.concat(this.team_2.players[1].hand);
		this.deck.recollectCards(team_1Cards,team_2Cards);

	},

	checkAllPlayerHand : function(){
		if(this.hasFourJackInAHand()){
			this.initializeGameAfterCancelation();
			return false;
		}
		return true;

	},

	ableToAskForTrumpSuit : function(playerHand){
		if(this.playedCards.length == 0)
			return false;
		var runningSuit = this.playedCards[0].getCardSuit();
		return !playerHand.some(function(card){
			return runningSuit == card.suit;
		});
	},

	roundWinner : function (){
		var playedCards = this.playedCards;
		var trumpSuit = this.trump.suit;
		var startingSuit = playedCards[0].getCardSuit();
		var standCard = playedCards[0];
		for (var i = 1;i < playedCards.length;i++){
			if (!playedCards[i].isTrumpShown() || startingSuit == trumpSuit)
				standCard = beforeTrumpShow(playedCards[i],startingSuit,standCard)
			else
				standCard = afterTrumpShow(playedCards[i],startingSuit,standCard,trumpSuit);
		};
		var winner = this.getPlayer(standCard.player);
		winner.addPoint(calculatePoint(this.playedCards));
		return standCard.getPlayerID();
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

	reduceBidValue : function(){
		if (this.bid.value < 21)
			this.bid.value = 16;
		else
			this.bid.value = +(this.bid.value) - 4;
	},

	deduceBidValue : function(){
		if (this.bid.value > 23)
			this.bid.value = 28;
		else
			this.bid.value = +(this.bid.value) + 4;
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
		var gainPoint = this[bidWinningTeam].getTotalTeamPoint();

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
		var playedCards = this.playedCards.map(function(playedCardStatus){
			var result = {
				card : playedCardStatus.getCard(),
				relation : self.whoAreYou(playedCardStatus.getPlayerID(), playerID)
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
	},

	getBidThreshold : function(playerID){
		var threshold = this.bid.value;
		if(playerID == this.bid.turn.lagging)
			return threshold + 1;
		return threshold;
	},

	playCard : function(playerID, cardID){
		var player = this.getPlayer(playerID);
		if(player.turn && this.isValidCardToThrow(cardID , player)){
			var thrownCard = player.throwCard(cardID);
			this.playedCards.push(new ThrownCardStatus(player.id, thrownCard, this.trump.open));
			this.nextTurn();
			return true;
		}
		return false;
	},

	updateActivityTime : function(){
		this.lastActivityTime = new Date();
	},

	isNotActive : function(){
		var now = new Date();
		var timeDifference = (now - this.lastActivityTime);
		if(timeDifference > 300000)
			return true;
		return false;
	}
};

module.exports = Game;
