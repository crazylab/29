var m = require('../team.js').team;
var gameModule = require('../game.js').game;

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
	var player = new m.Player('Raju');
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
				hand : ['S4','D5','C9','SK'],
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
});

describe('removeCard',function(){
	var player = new m.Player('ranju');
	player.hand = [
					{ id: 'H7', name: '7', suit: 'Heart', point: 0, rank: 8 },
					{ id: 'D9', name: '9', suit: 'Diamond', point: 2, rank: 2 },
					{ id: 'DJ', name: 'J', suit: 'Diamond', point: 3, rank: 1 },
					{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 } ];
	var carId = 'S9';
	var deletedCard = player.removeCard(carId);
	it('it removes the requested card from the player\'s hand',function(){
		expect(player.hand).to.have.length(3);
		expect(player.hand).not.to.contain({ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 });
	});

	it('returns the deleted card',function(){
		expect(deletedCard).to.deep.equal({ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 });
	})
});

describe('getMyCard',function(){
	var game = new gameModule.Game();
	var player = new m.Player('sayan');
	var playedCards = [{player:'sayan',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'sayani',
						card:{ name: '10', suit: 'Spade', point: 1, rank: 4 },
						trumpShown: false
						},
						{player:'brindaban',
						card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
						trumpShown: true
						},
						{player:'rahul',
						card:{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
						trumpShown: true
						}];
	it('returns a card played by the requested player',function(){
		var expected = {player:'sayan',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						};
		expect(player.getMyCard(playedCards)).to.deep.equal(expected);
	});
});



