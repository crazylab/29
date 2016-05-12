var ThrownCardStatus = require('./thrownCardStatus');

var _ = require('lodash');

var PlayedCards = function(){
    var playedCards = [];
    var trumpShownStatus = false;

    this.isStartOfRound = function(){
        return playedCards.length == 0;
    }
    this.isEndOfRound = function(){
        return playedCards.length == 4;
    }

    this.getRunningSuit =  function(){
        var firstPlayedCardStatus = _.first(playedCards);
        if(!firstPlayedCardStatus)
            return null;
        return firstPlayedCardStatus.getCardSuit();
    }

    this.pushCard =  function(playerID, card, trumpOpenStatus){
        if(this.isEndOfRound())
            throw new Error("Already contains 4 card");
        trumpShownStatus = trumpOpenStatus;
        playedCards.push(new ThrownCardStatus(playerID, card, trumpOpenStatus))
    }

    this.getStandCardStatus = function(){
        return _.first(playedCards);
    }

    this.isTrumpOpen = function(){
        return trumpShownStatus;
    }

    this.getAllCardsWithPlayerID = function(){
        return playedCards.map(function(playedCardStatus){
            var result = {
				card : playedCardStatus.getCard(),
				playerID : playedCardStatus.getPlayerID()
			};
			return result;
        });
    }

    this.getAllCards = function(){
        return playedCards.map(function(playedCardStatus){
			return playedCardStatus.getCard();
        });
    }

    this.getAllPlayedCardStatus = function(){
        return playedCards;
    }
}

module.exports = PlayedCards;
