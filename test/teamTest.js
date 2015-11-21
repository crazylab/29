var teamModule = require('../teamFormation.js').teamLib;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Team',function(){
	var players = ['Ramu','Haru','Shibu','Piku'];
	var team = new teamModule.Team(players);

	it('creates teams with two players',function(){
		expect(team).to.have.all.keys('team1','team2');
	});
	it('seperates two teams with players',function(){
		expect(team.team1).to.have.all.keys('player1','player2');
		expect(team.team2).to.have.all.keys('player1','player2');
	});
});

describe('Player',function(){
	var player = new teamModule.Player('Ramu');
	it('creates players with properties',function(){
		expect(player).to.have.all.keys('name','id','hand','hasPair');
	});
	it('creates the player and has proper data for its each property');

	describe('#types',function(){
		it('Properties are of different types',function(){
			assert.typeOf(player.id, 'string');
			assert.typeOf(player.hand, 'object');
			assert.typeOf(player.hasPair, 'boolean');
		});
	});
});