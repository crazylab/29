var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var createCard = require('../lib/createCard.js');

describe('createCard',function(){
	it('gives a read only card',function(){
		var heartA = createCard("A","Heart");
		var expectedCard = {
			id : 'HA',
			suit : 'Heart',
			name : 'A',
			point : 1,
			rank : 3
		};
		expect(expectedCard).to.deep.equals(heartA);

		heartA.rank = 1;
		expect(expectedCard).to.deep.equals(heartA);
	});
});
