var Game = require('../lib/game');
var team = require('../lib/team.js').team;
var Player = require('../lib/player');

var croupier = require('../lib/croupier.js').croupier;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('setDistributionSequence',function(){
	var game;
	beforeEach(function(){
		game = new Game();
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
	var game = new Game();
	var player1 = new Player('ramu');
	var player2 = new Player('raju');
	var player3 = new Player('ranju');
	var player4 = new Player('dhamu');
	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	game.distributionSequence = [player1,player3,player2,player4];
	
	croupier.distributeCards(game);
	game.playedCards = [{player:'ramu',
						card:{ id:'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'raju',
						card:{ id:'S10', name: '10', suit: 'Spade', point: 1, rank: 4 },
						trumpShown: false
						},
						{player:'ranju',
						card:{ id:'S8', name: '8', suit: 'Spade', point: 0, rank: 7 },
						trumpShown: true
						},
						{player:'dhamu',
						card:{ id:'HA', name: 'A', suit: 'Heart', point: 1, rank: 3 },
						trumpShown: true
						}];
	var status = game.getStatus('ranju');
	it('gives object with ownHand and length of partner, opponent_1, opponent_2 hand',function(){
		expect(status).to.have.all.keys('me', 'partner', 'opponent_1', 'opponent_2','trump','bid','playedCards',"isBidWinner","score");
	});
	it('gives four card IDs for the requested player',function(){
		expect(status.me.hand).to.have.length(4);
	});
	it('gives 4 cards for the 3 other player',function(){
		expect(status.partner.hand).to.equal(4);
		expect(status.opponent_1.hand).to.equal(4);
		expect(status.opponent_2.hand).to.equal(4);
	});
	it('gives all the cards that has already been played by a player',function(){
		expect(status.playedCards.me.card.id).to.equal('S8');
		expect(status.playedCards.partner.card.id).to.equal('HA');
		expect(status.playedCards.opponent_1.card.id).to.equal('HJ');
		expect(status.playedCards.opponent_2.card.id).to.equal('S10');
	});
});

describe('getPlayer',function(){
	var game = new Game();
	var player1 = new Player('ramu');
	var player2 = new Player('raju');
	var player3 = new Player('ranju');
	var player4 = new Player('dhamu');
	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	it('gives the requested player',function(){
		var playerId = 'ranju';
		expect(game.getPlayer(playerId)).to.deep.equal(player3);
	});
});

describe('setRoundSequence',function(){
	var game = new Game();
	var p1 = new Player('raju');
	var p2 = new Player('ramu');
	var p3 = new Player('raka');
	var p4 = new Player('rahul');
	game.team_1.players = [p1,p3];
	game.team_2.players = [p2,p4];
	game.setDistributionSequence();
	game.setRoundSequence();
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
	var game = new Game();
	var p1 = new Player('raju');
	var p2 = new Player('ramu');
	var p3 = new Player('raka');
	var p4 = new Player('rahul');
	game.team_1.players = [p1,p3];
	game.team_2.players = [p2,p4];
	game.setDistributionSequence();
	game.setRoundSequence();
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
describe('setBidWinner',function(){
	var game = new Game();
	var player = {id : '123',
					hand : {
						Heart : [],
						Spade : [],
						Club : [],
						Diamond : [],
						},
					hasPair : false
	}
	game.setBidWinner(16,player);
	
	it('sets the value of the highest bid as bid value',function(){
		expect(game.bid.value).to.not.equal(null);
	});

	it('sets the player who has bid the maximum',function(){
		expect(game.bid.player).to.not.equal(null);

	});
});	

describe('getFinalBidStatus',function(){
	var game = new Game();
	var player = {id : '123',
					hand : {
						Heart : [],
						Spade : [],
						Club : [],
						Diamond : [],
						},
					hasPair : false
	}
	game.setBidWinner(16,player);
	var bidStatus = game.getFinalBidStatus();
	it('gets the highest bid value which has already fibed',function(){
		expect(bidStatus).to.have.property('player').and.to.equal('123');
	});
	it('gets the bid value which has already fibed',function(){
		expect(bidStatus.value).to.equal(16);
	});
});

describe('isValidCardToThrow',function(){
	var game;
	beforeEach(function(){
		game = new Game();
		var p1 = new Player('raju');
		var p2 = new Player('ramu');
		var p3 = new Player('raka');
		var p4 = new Player('rahul');
		p1.hand = [
							{ id: 'H10', name: '10', suit: 'Heart', point: 1, rank: 4 },
	  						{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 },
							{ id: 'C8', name: '8', suit: 'Club', point: 0, rank: 7 },
	 						{ id: 'C7', name: '7', suit: 'Club', point: 0, rank: 8 } 
	 				];
		game.team_1.players = [p1,p3];
		game.team_2.players = [p2,p4];
	});
	it('allows a player to play any card of his hand when playedCards bucket is empty',function(){
		expect(game.isValidCardToThrow('S9',game.team_1.players[0].hand)).to.be.true;
	});
	it('only allows a player to play the running suit if he has that suit',function(){
							
		game.playedCards = [{card:{ id: 'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 }},
							{card:{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 }}];
		expect(game.isValidCardToThrow('H10',game.team_1.players[0].hand)).to.be.true;
		expect(game.isValidCardToThrow('S9',game.team_1.players[0].hand)).to.be.false;
	});
	it('allows a player to play any card of his hand if his hand doesn\'t contain running suit',function(){
		game.playedCards = [{card:{ id: 'DJ', name: 'J', suit: 'Diamond', point: 3, rank: 1 }},
							{card:{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 }}];
		expect(game.isValidCardToThrow('C8',game.team_1.players[0].hand)).to.be.true;
	});
});

describe('getRelationship',function(){
	var game = new Game();
	var player1 = new Player('ramu');
	var player2 = new Player('raju');
	var player3 = new Player('ranju');
	var player4 = new Player('dhamu');
	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];

	it('gets the relationship from a player\'s view',function(){
		var relation = game.getRelationship('ramu');
		var expectedRelation = {
			team : game.team_1,
			me : player1,
			partner : player2,
			opponentTeam : game.team_2,
			opponent_1 : player3,
			opponent_2 : player4
		};
		expect(relation).to.deep.equal(expectedRelation);
	});
});