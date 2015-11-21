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
	it('sets id for each player', function () {
		expect(team.team1.player1.id).to.equal('Ramu');
	});
});

describe('Player',function(){
	it('creates players with properties',function(){
		var player = new teamModule.Player();
		expect(player).to.have.all.keys('id','hand','hasPair');
	});
});