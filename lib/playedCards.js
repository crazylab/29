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
        return firstPlayedCardStatus.getCardSuit();
    }

    this.pushCard =  function(playerID, card, trumpOpenStatus){
        if(this.isEndOfRound())
            throw new Error("Already contains 4 card");
        trumpShownStatus = trumpOpenStatus;
        playedCards.push(new ThrownCardStatus(playerID, card, trumpOpenStatus))
    }
}

module.exports = PlayedCards;
