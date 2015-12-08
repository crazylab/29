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
	it('gives object with ownHand and length of partner, opponent_1, opponent_2 hand',function(){
		expect(status).to.have.all.keys('ownHand', 'partner', 'opponent_1', 'opponent_2','trump','playedCards','turn');
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

describe('getPlayer',function(){
	var game = new gameModule.Game();
	var player1 = new team.Player('ramu');
	var player2 = new team.Player('raju');
	var player3 = new team.Player('ranju');
	var player4 = new team.Player('dhamu');
	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	it('gives the requested player',function(){
		var playerId = 'ranju';
		expect(game.getPlayer(playerId)).to.deep.equal(player3);
	});
});

describe('getMyCard',function(){
	var game = new gameModule.Game();
	var playedCards = [{player:'sayan',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'sayani',
						card:{ name: '10', suit: 'Spade', point: 1, rank: 4 },
						trumpShown: false
						},
						{player:'brindaban',
						card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
						trumpShown: true
						},
						{player:'rahul',
						card:{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
						trumpShown: true
						}];
	it('returns a card played by the requested player',function(){
		var expected = {player:'sayan',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						};
		expect(gameModule.getMyCard(playedCards,'sayan')).to.deep.equal(expected);
	});
});
describe('setRoundSequence',function(){
	var game = new gameModule.Game();
	var p1 = new team.Player('raju');
	var p2 = new team.Player('ramu');
	var p3 = new team.Player('raka');
	var p4 = new team.Player('rahul');
	game.team_1.players = [p1,p3];
	game.team_2.players = [p2,p4];
	game.setDistributionSequence();
	it('initially roundSequence is equal to distribution sequence',function(){
		expect(game.roundSequence).to.deep.equal(game.distributionSequence);
	});
	it('initially first player of roundSequence has turn true',function(){
		expect(game.roundSequence[0].turn).to.be.true;
	});
	it('gives the roundSequence depending upon the round winner',function(){
		game.setRoundSequence('ramu');
		expect(game.roundSequence).to.deep.equal([p2,p3,p4,p1]);

		game.setRoundSequence('rahul');
		expect(game.roundSequence).to.deep.equal([p4,p1,p2,p3]);
	});
	it('all time first player of roundSequence has turn true', function(){
		expect(game.roundSequence[0].turn).to.be.true;
	});
});

describe('nextTurn',function(){
	var game = new gameModule.Game();
	var p1 = new team.Player('raju');
	var p2 = new team.Player('ramu');
	var p3 = new team.Player('raka');
	var p4 = new team.Player('rahul');
	game.team_1.players = [p1,p3];
	game.team_2.players = [p2,p4];
	game.setDistributionSequence();
	game.nextTurn();
	it('gives the trun permission true of the next player',function(){
		expect(game.roundSequence[0].turn).to.be.false;
		expect(game.roundSequence[1].turn).to.be.true;
		expect(game.roundSequence[2].turn).to.be.false;
		expect(game.roundSequence[3].turn).to.be.false;

		game.nextTurn();
		expect(game.roundSequence[0].turn).to.be.false;
		expect(game.roundSequence[1].turn).to.be.false;
		expect(game.roundSequence[2].turn).to.be.true;
		expect(game.roundSequence[3].turn).to.be.false;
	});
})








