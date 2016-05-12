var ThrownCardStatus = function(playerID, playedCard, trumpOpen){
    this.playerID = playerID;
    this.playedCard = playedCard;
    this.trumpOpen = trumpOpen;
}

ThrownCardStatus.prototype = {
    getCardSuit : function(){
        return this.playedCard.suit;
    },

    getCardID : function(){
        return this.playedCard.id;
    },
    
    isTrumpShown : function(){
        return this.trumpOpen == true;
    },

    getCard : function(){
        return this.playedCard;
    },

    getPlayerID : function(){
        return this.playerID;
    }
}

module.exports = ThrownCardStatus;
