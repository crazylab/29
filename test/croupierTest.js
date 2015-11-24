var m = require('../croupier.js').croupier;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('getShuffledDeck',function(){
	var shuffledDeck = m.getShuffledDeck();
	it('gives the deck with shuffle property',function(){
		expect(shuffledDeck).to.have.all.keys('cards');
	});
	describe('shuffle',function(){
		it('will get 32 cards after shuffling',function(){
			expect(shuffledDeck.cards).to.have.length(32);
		});
	});
});

describe('setIdAndNames',function(){
	var playerNames = ['Ramu','Manu','Ram','Hari'];
	var playersWithID = m.setIdAndNames(playerNames);
	it('sets id for each player and asserts name to each',function(){
		expect(playersWithID).to.have.all.keys('team_1','team_2');
	});
	describe('player\'s id',function(){
		var team1 = playersWithID.team_1;
		it('is present for each player',function(){
			expect(team1.player_1).to.have.property('id');
			expect(team1.player_2).to.have.property('id');
			assert.equal(team1.player_2.name,'Ram');
		});
		it('also takes care of making the IDs unique',function(){
			assert.notEqual(team1.player_2.id,playersWithID.team_2.player_2.id);
		});
	});

});