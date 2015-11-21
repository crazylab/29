var m = require('../deck.js').m;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Card',function(){
	describe('Property',function(){
		it('has suit, name, rank, point',function(){
			expect(new m.Card('A','Diamond')).to.have.all.keys('suit','name','rank','point');
		});
	});
	it('is given with its rank and point according to its name',function(){
		var diamondA = {
			name : 'A',
			suit : 'Diamond',
			point : 1,
			rank : 3
		};
		assert.deepEqual(new m.Card('A','Diamond'),diamondA);
		
		var spadeK = {
			name : 'K',
			suit : 'Spade',
			point : 0,
			rank : 5
		};
		assert.deepEqual(new m.Card('K','Spade'),spadeK);

		var clubQ = {
				name : 'Q',
				suit : 'Club',
				point : 0,
				rank : 6
			};
		assert.deepEqual(new m.Card('Q','Club'),clubQ);

		var heartJ = {
				name : 'J',
				suit : 'Heart',
				point : 3,
				rank : 1
			};
		assert.deepEqual(new m.Card('J','Heart'),heartJ);
	});
});
describe('Deck',function(){
	it('length should be of 32 cards',function(){
		var deck = new m.Deck;
		assert.equal(deck.length,32);
	});
});
