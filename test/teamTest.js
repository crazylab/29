var teamModule = require('../teamFormation.js').teamLib;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Team',function(){
	it('creates teams with two players',function(){
		var players = ['Ramu','Haru','Shibu','Piku'];
		var team = new teamModule.Team(players);
		expect(team).to.have.all.keys('team1','team2');
	});
});

describe('Player',function(){
	it('creates players with properties',function(){
		var player = new teamModule.Player();
		expect(player).to.have.all.keys('id','hand','hasPair');
		assert.typeOf(player.id,'function', 'it should be a method to allocate ids to the players');
		assert.typeOf(player.hand,'object', 'it must be an object');
		assert.typeOf(player.hasPair,'boolean', 'it must be a boolean');
	});
});