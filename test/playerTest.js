var Player = require('../lib/player');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Player',function(){
	var player = new Player('Raju');
	player.hand = [{id:'S4'},{id:'D5'},{id:'C9'},{id:'SK'}];
	it('creates player with properties',function(){
		expect(player).to.have.all.keys('hand','hasPair','turn','id','isFinalBidder');
	});
	describe('types',function(){
		it('Properties are of different types',function(){
			assert.typeOf(player.hand, 'array');
			assert.typeOf(player.hasPair, 'boolean');
			assert.typeOf(player.isFinalBidder, 'boolean');
		});
	});
	describe('getStatus',function(){
		it('gives the player\'s status with card IDs when the player is not third party',function(){
			var status = player.getStatus(false);
			var expectedStatus = {
				hand : [
					{id:'S4'},
					{id:'D5'},
					{id:'C9'},
					{id:'SK'}
				],
				turn : false,
				isBidder : false
			};
			expect(status).to.deep.equal(expectedStatus);
		});
		it('gives the player\'s status with number of cards in hand when the player is third party',function(){
			var status = player.getStatus(true);
			var expectedStatus = {
				hand : 4,
				turn : false,
				isBidder : false
			};
			expect(status).to.deep.equal(expectedStatus);
		});
	});
});