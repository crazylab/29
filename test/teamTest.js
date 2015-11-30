var m = require('../teamFormation.js').team;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Team',function(){
	var player_1 = '10.2.40.134';
	var player_2 = '10.3.56.129';
	var team = new m.Team(player_1,player_2);

	it('creates team with two players',function(){
		expect(team).to.have.all.keys('10.2.40.134','10.3.56.129','wonCards');
	});
});

describe('Player',function(){
	var player = new m.Player();
	it('creates player with properties',function(){
		expect(player).to.have.all.keys('hand','hasPair');
	});
	describe('types',function(){
		it('Properties are of different types',function(){
			assert.typeOf(player.hand, 'object');
			assert.typeOf(player.hasPair, 'boolean');
		});
	});
});