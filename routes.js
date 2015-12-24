var fs = require('fs');
var querystring = require('querystring');

var game = require('./game.js').game;
var ClientHandler = require('./clientHandler.js');
var clientHandler = new ClientHandler(new game.Game());
