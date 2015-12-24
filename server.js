var http = require('http');
var Game = require('./game.js').game.Game;
var GameController = require('./gameController');
var controller = GameController(new Game());
const PORT = 3000;
http.createServer(controller).listen(PORT).on('error',function(err){
	console.log(err.message);
});