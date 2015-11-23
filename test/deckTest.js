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
	var deck;
	beforeEach(function(){
		deck = new m.Deck;
	});
	describe('dealCards',function(){
		it('gives 4 cards',function(){
			expect(deck.dealCards).to.have.length(4);
		});
		it('will gives error message when no more card is available',function(){
			while(deck.cards.length != 0 ){
				deck.dealCards;
			}
			var err = new Error('No more cards available.');
			assert.deepEqual(deck.dealCards,err);
		});
	});
	it('will have 4 cards less after each dealing of Cards',function(){
		for(var cards = 28; cards!= 0; cards = cards - 4){
			deck.dealCards;
			expect(deck.cards).to.have.length(cards);	
		};
	});
});