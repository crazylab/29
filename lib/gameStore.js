var gameBucket = {
    latestGame : null,
    addGame : function (game) {
        var gameID = game.getID();
        this[gameID] = game;
        this.latestGame = game;
    },

    getLatestGame : function () {
        return this.latestGame;
    },

    getGame : function (gameID) {
        return this[gameID] ? this[gameID] : null;
    },

    deleteGame : function (gameID) {
        if(!this[gameID])
            return false;
        delete this[gameID];
        return true;
    }

};

module.exports = gameBucket;
