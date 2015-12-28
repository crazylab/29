var http = require('http');
var Game = require('./lib/game');
var GameController = require('./lib/gameController');
var controller = GameController(new Game());
const PORT = 3000;
http.createServer(controller).listen(PORT).on('error',function(err){
	console.log(err.message);
});