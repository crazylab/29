var game = require('../main.js').game;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('distribute',function(){
	var gameStatus = game.assignTeam(['1','2','3','4']);
	gameStatus = game.distributeCards();
	it('gives four cards to each player from deck',function(){
		var hand1 = gameStatus['1'].hand;
		var hand2 = gameStatus['2'].hand;
		var hand3 = gameStatus['3'].hand;
		var hand4 = gameStatus['4'].hand;

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
	var gameStatus = game.assignTeam(['1','2','3','4']);
	gameStatus = game.distributeCards();
	var status = game.getStatus('2');

	it('gives object with ownHand and length of partner, opponent_1, opponent_2 hand',function(){
		expect(status).to.have.all.keys('ownHand', 'partner', 'opponent_1', 'opponent_2');
	});
	it('gives four card IDs for the requested player',function(){
		expect(status.ownHand).to.have.length(4);
	});
	it('gives 3 for the other player',function(){
		expect(status.partner).to.equal(4);
		expect(status.opponent_1).to.equal(4);
		expect(status.opponent_2).to.equal(4);
	});
});