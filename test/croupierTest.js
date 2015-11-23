var m = require('../croupier.js').croupier;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('shuffle',function(){
	it('gives the deck with shuffle property',function(){
		expect(m.getShuffledCards()).to.have.all.keys('cards');
	});
	it('will get 32 cards after shuffling',function(){
		expect(m.getShuffledCards().cards).to.have.length(32);
	});
})