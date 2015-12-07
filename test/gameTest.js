var gameModule = require('../game.js').game;
var team = require('../team.js').team;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('distribute',function(){
	var game = new gameModule.Game();
	var gameStatus = game.assignTeam(['1','2','3','4']);

	gameStatus = game.distributeCards();
	it('gives four cards to each player from deck',function(){
		var hand1 = game.team_1.players[0].hand;
		var hand2 = game.team_1.players[1].hand;
		var hand3 = game.team_2.players[0].hand;
		var hand4 = game.team_2.players[1].hand;

		var totalCard = hand1.Heart.length + hand1.Spade.length + hand1.Club.length + hand1.Diamond.length;
		expect(totalCard).to.equal(4);

		var totalCard = hand2.Heart.length + hand2.Spade.length + hand2.Club.length + hand2.Diamond.length;
		expect(totalCard).to.equal(4);

		var totalCard = hand3.Heart.length + hand3.Spade.length + hand3.Club.length + hand3.Diamond.length;
		expect(totalCard).to.equal(4);

		var totalCard = hand4.Heart.length + hand4.Spade.length + hand4.Club.length + hand4.Diamond.length;
		expect(totalCard).to.equal(4);
	});
});
describe('getStatus',function(){
	var game = new gameModule.Game();
	var gameStatus = game.assignTeam(['1','two','3','4']);
	gameStatus = game.distributeCards();
	var status = game.getStatus('two');

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
describe('assignPlayerToATeam',function(){
	it('assigns player to a team in one game',function(){

	})
});
describe('assignTeam',function(){
	var game = new gameModule.Game();
	game.assignTeam(['1','2','3','4']);
	it('assigns player to a team',function(){
		expect(game.team_1.players[0].id).to.equal('1');
	});
});
describe('setBidWinner',function(){
	var game = new gameModule.Game();
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
		expect(game.bid.value).to.equal(16);
	});

	it('sets the player who has bid the maximum',function(){
		expect(game.bid.player).to.have.property('id').and.to.equal('123');
	});
});


