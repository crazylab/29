var http = require('http');
var Game = require('./lib/game.js');
var GameController = require('./lib/gameController.js');
var createGame = require('./lib/createGame.js');

var controller = GameController(createGame());

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

http.createServer(controller).listen(port, ipaddress).on('error',function(err){
	console.log(err.message);
});
