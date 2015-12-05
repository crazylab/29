var gameModule = require('../game.js').game;
var team = require('../team.js').team;
var croupier = require('../croupier.js').croupier;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('setDistributionSequence',function(){
	var game;
	beforeEach(function(){
		game = new gameModule.Game();
		game.team_1.players = [1,2];
		game.team_2.players = [3,4];
	});
	it('at first distribution sequence will be empty',function(){
		expect(game.distributionSequence).to.be.empty;
	});
	it('set distribution sequence first time',function(){
		game.setDistributionSequence();
		expect(game.distributionSequence).to.have.length(4);
		expect(game.distributionSequence).to.deep.equal([1,3,2,4]);
	});
});


describe('getStatus',function(){
	var game = new gameModule.Game();
	var player1 = new team.Player('ramu');
	var player2 = new team.Player('raju');
	var player3 = new team.Player('ranju');
	var player4 = new team.Player('dhamu');
	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	game.distributionSequence = [player1,player3,player2,player4];
	
	croupier.distributeCards(game);
	var status = game.getStatus('ranju');
	console.log(game.team_2.players[0].hand)
	it('gives object with ownHand and length of partner, opponent_1, opponent_2 hand',function(){
		expect(status).to.have.all.keys('ownHand', 'partner', 'opponent_1', 'opponent_2','trumpStatus');
	});
	it('gives four card IDs for the requested player',function(){
		expect(status.ownHand).to.have.length(4);
	});
	it('gives 4 cards for the 3 other player',function(){
		expect(status.partner).to.equal(4);
		expect(status.opponent_1).to.equal(4);
		expect(status.opponent_2).to.equal(4);
	});
});