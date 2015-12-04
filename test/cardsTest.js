var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var cards = require('../cards.js');

describe('generateCards',function(){
	it('generates all playing cards and gives a deck of 32 cards',function(){
		expect(cards.generateCards()).to.have.length(32);
	});
	describe('Card',function(){
		it('has the properties id, suit, name, point, rank',function(){
			var card = cards.generateCards()[30];
			expect(card).to.have.all.keys('id','suit','name','point','rank');
		})
	})
});