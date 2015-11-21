var m = require('../deck.js').m;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Card',function(){
	describe('property',function(){
		it('has suit',function(){
			assert.property(new m.Card('A','Diamond'),'suit');
		});
		it('has name',function(){
			assert.property(new m.Card('K','Spade'),'name');
		});
		it('has rank',function(){
			assert.property(new m.Card('Q','Club'),'rank');
		});
		it('has point',function(){
			assert.property(new m.Card('J','Heart'),'point');
		});
	});
	describe('identity',function(){
		it('is A of Diamond',function(){
			var expected = {
				name : 'A',
				suit : 'Diamond',
				point : 1,
				rank : 3
			};
			assert.deepEqual(new m.Card('A','Diamond'),expected);
		});
		it('is K of Spade',function(){
			var expected = {
				name : 'K',
				suit : 'Spade',
				point : 0,
				rank : 5
			};
			assert.deepEqual(new m.Card('K','Spade'),expected);
		});
		it('is Q of Club',function(){
			var expected = {
				name : 'Q',
				suit : 'Club',
				point : 0,
				rank : 6
			};
			assert.deepEqual(new m.Card('Q','Club'),expected);
		});
		it('is J of Heart',function(){
			var expected = {
				name : 'J',
				suit : 'Heart',
				point : 3,
				rank : 1
			};
			assert.deepEqual(new m.Card('J','Heart'),expected);
		});
	});
});
describe('Deck',function(){
	it('length should be of 32 cards',function(){
		var deck = new m.Deck;
		assert.equal(deck.length,32);
	});
});
