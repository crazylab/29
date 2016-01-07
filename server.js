var http = require('http');
var Game = require('./lib/game');
var GameController = require('./lib/gameController');
var createGame = require('./lib/createGame');

var controller = GameController(createGame());
const PORT = 3456;
http.createServer(controller).listen(PORT).on('error',function(err){
	console.log(err.message);
});