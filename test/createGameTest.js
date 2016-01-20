var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var createGame = require('../lib/createGame');
var Game = require('../lib/game');

describe('createGame',function() {
	it('creates a new game every time the function is called',function(){
		var newGame = createGame();
		expect(newGame).to.be.an.instanceof(Game);
	});
}); 