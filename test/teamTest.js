var Team = require('../lib/team');
var Player = require('../lib/player');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;


describe('Team',function(){
	describe('addPlayer',function(){
		var player_1 = 'happy';
		var player_2 = 'lisa';
		var player_3 = 'prerna';

		var team = new Team();
		it('adds beta player into team when there is less than 2 player in the team.',function(){
			var player = new Player(player_1);
			team.addPlayer(player);
			expect(team.players).to.contain(player);
		});
		it('can not have more than 2 players',function(){
			var player2 = new Player(player_2);
			var player3 = new Player(player_3);

			team.addPlayer(player2);

			try{
				team.addPlayer('peter',player3)
			}catch(e){
				expect(e.message).to.equals('not enough space');
			}
			expect(team.players).to.contain(player2);
			expect(team.players).to.not.contain(player3);
		});
	});

	var team = new Team();
	var player_1 = new Player('beta');
	var player_2 = new Player('alpha');
	team.players.push(player_1);
	team.players.push(player_2);
	describe('getPlayer',function(){
		it('gives player of the given id',function(){
			expect(team.getPlayer('beta')).to.deep.equals(player_1);
			expect(team.getPlayer('alpha')).to.deep.equals(player_2);
		});
	});
	describe('getPartner',function(){
		it('gives partner of the given id',function(){
			expect(team.getPartner('beta')).to.deep.equals(player_2);
			expect(team.getPartner('alpha')).to.deep.equals(player_1);
		});
	});
	describe('hasPlayer',function(){
		it('checks whether there is given player or not',function(){
			expect(team.hasPlayer('beta')).to.be.true;
		});
	});
	
	describe('getMyCard',function(){
		var player = new Player('john');
		var playedCards = [{player:'john',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'piku',
							card:{ name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							},
							{player:'ritam',
							card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'rohan',
							card:{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
							trumpShown: true
							}];
		it('returns a card played by the requested player',function(){
			var expected = {player:'john',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							};
			expect(player.getMyCard(playedCards)).to.deep.equal(expected);
		});
	});

});
