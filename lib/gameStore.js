var _ = require('lodash');

var gameBucket = {
  games : [],

  addGame : function (game) {
    this.games.push(game);
  },

  getLatestGame : function () {
    return _.last(this.games);
  },

  getGame : function (gameId) {
    var games = this.games;
    for (var i = 0; i < games.length; i++)
        if (games[i].getId() == gameId)
            return games[i];
    return null;
  },

  deleteGame : function (gameId) {
    var games = this.games;
    for (var i = 0; i < games.length; i++) {
      if (games[i].getId() == gameId) {
        delete games[i];
        return true;
      }
    }
    return false;
  }
};

module.exports = gameBucket;
