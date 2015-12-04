var m = require('../teamFormation.js').team;
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Team',function(){
	var player_1 = 'abc';
	var player_2 = 'def';
	var player_3 = 'sss';

	var team = new m.Team();

	it('creates team with two players',function(){
		expect(team).to.have.all.keys('players','score','wonCards');
	});
	it('adds one player into team when there is less than 2 player in the team.',function(){
		var player = new m.Player(player_1);
		team.addPlayer(player);
		expect(team.players).to.contain(player);
	});
	it('can not have more than 2 players',function(){
		var player2 = new m.Player(player_2);
		var player3 = new m.Player(player_3);

		team.addPlayer(player2);
		
		try{
			team.addPlayer('sdf',player3)			
		}
		catch(e){
			expect(e.message).to.equals('not enough space');
		}
		expect(team.players).to.contain(player2);
		expect(team.players).to.not.contain(player3);
	});
});

describe('Player',function(){
	var player = new m.Player();
	it('creates player with properties',function(){
		expect(player).to.have.all.keys('hand','hasPair','id');
	});
	describe('types',function(){
		it('Properties are of different types',function(){
			assert.typeOf(player.hand, 'object');
			assert.typeOf(player.hasPair, 'boolean');
		});
	});
});
describe('Team',function(){
	var team = new m.Team();
	var player_1 = new m.Player('one');
	var player_2 = new m.Player('two');
	team.players.push(player_1);
	team.players.push(player_2);
	describe('getPlayer',function(){
		it('gives player of the given id',function(){
			expect(team.getPlayer('one')).to.deep.equals(player_1);
			expect(team.getPlayer('two')).to.deep.equals(player_2);
		})
	});
	describe('getPartner',function(){
		it('gives partner of the given id',function(){
			expect(team.getPartner('one')).to.deep.equals(player_2);
			expect(team.getPartner('two')).to.deep.equals(player_1);
		})
	});
	describe('hasPlayer',function(){
		it('checks whether there is given player or not',function(){
			expect(team.hasPlayer('one')).to.be.true;
		})
	})
})