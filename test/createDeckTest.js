var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var createDeck = require('../lib/createDeck.js');

describe('createDeck',function(){
	describe('getCards',function(){
		var	cards = [{id : 'K'},
					{id : '8'},
					{id : 'Q'},
					{id : '7'},
					{id : '9'},
					{id : 'J'},
					{id : '2'},
					{id : '4'},
					{id : '6'},
					{id : '5'}];
		it('has given number of cards',function(){
			var deck = createDeck(cards);
			expect(deck.getCards()).to.have.length(10);
		});
	});
	describe('drawFourCards',function(){
		var	cards = [{id : 'K'},
					{id : '8'},
					{id : 'Q'},
					{id : '7'},
					{id : '9'},
					{id : 'J'},
					{id : '2'},
					{id : '4'},
					{id : '6'},
					{id : '5'}];
		var deck = createDeck(cards);
		var expectedCards_1st_Time = [	{id : 'K'},
										{id : '8'},
										{id : 'Q'},
										{id : '7'}];

		it('gives 4 cards from the top of the Deck',function(){
			expect(deck.drawFourCards()).to.deep.equal(expectedCards_1st_Time);
		});
		it('from Deck of 10 cards after drawing 4 it has only 6 cards left',function(){
			expect(deck.getCards()).to.have.length(6);
		});
		it('does not give same card as before',function(){
			expect(deck.drawFourCards()).to.not.deep.equal(expectedCards_1st_Time);
		});
	});
	describe('shuffle',function(){
		var	cards = [{id : 'K'},
					{id : '8'},
					{id : 'Q'},
					{id : '7'},
					{id : '9'},
					{id : 'J'},
					{id : '2'},
					{id : '4'},
					{id : '6'},
					{id : '5'}];

		it('does not gives the same arrangement of cards as before',function(){
			var deck = createDeck(cards);
			expect(deck.getCards()).to.deep.equal(cards);

			deck.shuffle();	
			expect(deck.getCards()).to.not.deep.equal(cards);
		});
	});
});