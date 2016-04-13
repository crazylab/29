var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var createCard = require('../lib/createCard.js');
var Card = require('../lib/card.js');

describe('createCard',function(){
	it('gives a read only card',function(){
		var heartA = createCard("A","Heart");
		var expectedCard = new Card("A", "Heart");
		expect(expectedCard).to.deep.equals(heartA);

		heartA.rank = 1;
		expect(expectedCard).to.deep.equals(heartA);
	});

	it('gives error message when the given suit is invalid',function(){
		try {
			createCard("A","boom");
		} catch (e) {
			expect('Invalid card suit').to.equals(e.message);
		};
	});

	it('gives error message when the given card name is invalid',function(){
		try {
			createCard("X","Heart");
		} catch (e) {
			expect('Invalid card name').to.equals(e.message);
		};
	});
});
