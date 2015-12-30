var chai = require('chai');
var expect = chai.expect;

var generateCards = require('../lib/generateCards.js');

describe('generateCards',function(){
	it('gives 32 cards',function(){
		expect(generateCards()).to.have.length(32);
	});
});