var m = require('../teamFormation.js').team;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Team',function(){
	var player_1 = {name: 'PK', id: '4'};
	var player_2 = {name: 'RJ', id: '5'};
	var team = new m.Team(player_1,player_2);

	it('creates team with two players',function(){
		expect(team).to.have.all.keys('player_1','player_2');
	});
	it('has player with given name with empty hand',function(){
		var player_1 = new m.Player('PK','4');
		var player_2 = new m.Player('RJ', '5');
		var expected = {player_1 : player_1, player_2: player_2};
		assert.deepEqual(team, expected);
	});
});

describe('Player',function(){
	var player = new m.Player('Ramu','5');
	it('creates player with properties',function(){
		expect(player).to.have.all.keys('name','id','hand','hasPair');
	});
	describe('types',function(){
		it('Properties are of different types',function(){
			assert.typeOf(player.name, 'string');
			assert.typeOf(player.id, 'string');
			assert.typeOf(player.hand, 'object');
			assert.typeOf(player.hasPair, 'boolean');
		});
	});
});