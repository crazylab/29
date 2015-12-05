var m = require('../croupier.js').croupier;
var team = require('../team.js').team;
var d = require('../cards.js').m;
var g = require('../game.js').game;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('setBid', function() {
	var p1 = new team.Player('raju','45');
	var p2 = new team.Player('ramu','5');
	var p3 = new team.Player('raka','4');
	var p4 = new team.Player('rahul','450');
	var team1 = new team.Team(p1,p3);
	var team2 = new team.Team(p2,p4);
	var bid;

	beforeEach(function () {
		m.bid = {
			value : null,
			player : null
		};
		var playerSequence = [team1.player_1, team2.player_1, team1.player_2, team2.player_2];
		bid = m.setBid(playerSequence);
	});
	it('takes player sequence and starts bidding from first player', function() {
		bid(16);
		expect(m.bid.value).to.equal(16);
		expect(m.bid.player).to.deep.equal(team1.player_1);
	});
	it('does not set bid value less than 16 and greater than 28', function() {
		bid(15);
		expect(m.bid.value).to.not.equal(15);
		expect(m.bid.player).to.be.null;

		bid(30);
		expect(m.bid.value).to.not.equal(30);
		expect(m.bid.player).to.be.null;		
	});
	it('sets bid more than previous bid value', function() {
		bid(16);
		bid(17);
		expect(m.bid.value).to.equal(17);
		expect(m.bid.player).to.deep.equal(team2.player_1);
	});
	it('second player cannot bid same as first player bid', function() {
		bid(16);
		bid(16);
		expect(m.bid.value).to.equal(16);
		expect(m.bid.player).to.deep.equal(team1.player_1);
	});
	it('first player set bid same as second player', function() {
		bid(16);
		bid(18);
		bid(18);
		expect(m.bid.value).to.equal(18);
		expect(m.bid.player).to.deep.equal(team1.player_1);
	});
	describe('pass',function(){
		it('removes player from player sequence',function(){
			bid(16);
			bid(18);
			bid('pass');
			expect(m.bid.value).to.equal(18);
			expect(m.bid.player).to.deep.equal(team2.player_1);	
		});
	})
});


// describe('setIdAndNames',function(){
// 	var playerNames = ['10.2.45.178','10.2.45.173','10.2.45.192','10.4.45.191'];
// 	var playersWithID = m.makeTeams(playerNames);
// 	it('sets id for each player and asserts name to each',function(){
// 		expect(playersWithID).to.have.all.keys('team_1','team_2');
// 	});
// });

describe('calculateTotalPoint',function(){
	var teamBucket = [{ name: '10', suit: 'Heart', point: 1, rank: 4 },
  						{ name: '9', suit: 'Spade', point: 2, rank: 2 },
						{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
 						{ name: '7', suit: 'Club', point: 0, rank: 8 } ,
						{ name: '8', suit: 'Heart', point: 0, rank: 7 },
						{ name: 'Q', suit: 'Diamond', point: 0, rank: 6 },
						{ name: '8', suit: 'Spade', point: 0, rank: 7 },
						{ name: '8', suit: 'Club', point: 0, rank: 7 },
						{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
  						{ name: '7', suit: 'Spade', point: 0, rank: 8 },
						{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
 						{ name: 'J', suit: 'Club', point: 3, rank: 1 } ,
						{ name: '10', suit: 'Diamond', point: 1, rank: 4 },
						{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
						{ name: '10', suit: 'Club', point: 1, rank: 4 },
						{ name: 'K', suit: 'Spade', point: 0, rank: 5 }];
	it('calculate TotalPoint of a team',function(){
		assert.equal(14,m.calculateTotalPoint(teamBucket));
	});

});

describe('roundWinner',function(){
	it('gives the id of the player who won the round before trumpShown',function(){
		var playedCardsSet_1 = [{player:'10.4.20.173_sayan',
						card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
						trumpShown: false
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
						trumpShown: false
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
						trumpShown: false
						}];
		var playedCardsSet_2 = [{player:'10.4.20.173_sayan',
							card:{ name: '7', suit: 'Spade', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'10.4.20.163_sayani',
							card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
							trumpShown: false
							},
							{player:'10.4.20.143_brindaban',
							card:{ name: 'J', suit: 'Spade', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'10.4.20.153_rahul',
							card:{ name: '9', suit: 'Spade', point: 2, rank: 2 },
							trumpShown: false
							}];
		var playedCardsSet_3 = [{player:'10.4.20.173_sayan',
						card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: 'J', suit: 'Spade', point: 3, rank: 2 },
						trumpShown: false
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						}];
		assert.equal('10.4.20.153_rahul',m.roundWinner(playedCardsSet_1));
		assert.equal('10.4.20.143_brindaban',m.roundWinner(playedCardsSet_2));
		assert.equal('10.4.20.173_sayan',m.roundWinner(playedCardsSet_3));

	});
	it('gives the id of the player who won the round after trumpShown',function(){
		var playedCardsSet_1 = [{player:'10.4.20.173_sayan',
						card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
						trumpShown: true
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
						trumpShown: true
						}];
		var playedCardsSet_2 = [{player:'10.4.20.173_sayan',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '10', suit: 'Spade', point: 1, rank: 4 },
						trumpShown: false
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
						trumpShown: true
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
						trumpShown: true
						}];
		var playedCardsSet_3 = [{player:'10.4.20.173_sayan',
						card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
						trumpShown: true
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: true
						}];
		var playedCardsSet_4 = [{player:'10.4.20.173_sayan',
						card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
						trumpShown: true
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: true
						}];
		var playedCardsSet_5 = [{player:'10.4.20.173_sayan',
						card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
						trumpShown: true
						},
						{player:'10.4.20.163_sayani',
						card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'10.4.20.143_brindaban',
						card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
						trumpShown: true
						},
						{player:'10.4.20.153_rahul',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: true
						}];

		assert.equal('10.4.20.163_sayani',m.roundWinner(playedCardsSet_1,'Diamond'));
		assert.equal('10.4.20.143_brindaban',m.roundWinner(playedCardsSet_2,'Spade'));
		assert.equal('10.4.20.163_sayani',m.roundWinner(playedCardsSet_3,'Diamond'));
		assert.equal('10.4.20.143_brindaban',m.roundWinner(playedCardsSet_4,'Diamond'));
		assert.equal('10.4.20.153_rahul',m.roundWinner(playedCardsSet_5,'Club'));


	})
});
/*describe('assignAPlayer',function(){
	it('assigns a player to a team',function(){
		var player_id1 = 'one';
		var game = game.newGame();


	});
});*/
describe('makeGame',function(){
	var newGame = new g.Game();
	it('creates a new game with intial values',function(){
		expect(newGame).to.have.all.keys('deck','distributionSequence','roundSequence','trump','playedCards','bid','team_1','team_2');
	});
	it('creates a game whose deck is of 32 cards',function(){
		expect(newGame.deck).to.have.length(32);
	});
});

describe('countPlayer',function(){
	it('counts the number of player a game has',function(){
		var game = {
			team_1 : {players : ['Ramu','Mamu']},
			team_2 : {players : ['Dada']}
		};
		expect(m.countPlayer(game)).to.equal(3);
	});
	it('gives zero when there is no player',function(){
		var game = {
			team_1 : {players : []},
			team_2 : {players : []}
		};
		expect(m.countPlayer(game)).to.equal(0);
	});
});

describe('assignPlayer',function(){
	it('assigns a player to team_1 when there are no player in both the team',function(){
		var game = new g.Game();
		var player = 'Ramu';
		var game = m.assignPlayer(game,player);
		expect(game.team_1.players).to.have.length(1);
		expect(game.team_2.players).to.have.length(0);
		expect(game.team_1.players[0]).to.equal('Ramu');
	});
	it('assigns a player in team_2 when team_1 has two players and team_2 has one player already',function(){
		var game = new g.Game();
		game.team_1.players.push('ramu');
		game.team_1.players.push('raju');
		game.team_2.players.push('tanu');

		var player = 'Shibu';
		var game = m.assignPlayer(game,player);
		expect(game.team_1.players).to.have.length(2);
		expect(game.team_2.players).to.have.length(2);
		expect(game.team_2.players[1]).to.equal('Shibu');
	});
});
describe('distribute',function(){
	var game = new g.Game();
	var player1 = new team.Player('ramu');
	var player2 = new team.Player('raju');
	var player3 = new team.Player('ranju');
	var player4 = new team.Player('dhamu');
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	game.setDistributionSequence();
	m.distributeCards(game);
	it('gives four cards to each player from deck',function(){
		var hand1 = game.team_1.players[0].hand;
		var hand2 = game.team_1.players[1].hand;
		var hand3 = game.team_2.players[0].hand;
		var hand4 = game.team_2.players[1].hand;

		expect(hand1).to.have.length(4);
		expect(hand2).to.have.length(4);
		expect(hand3).to.have.length(4);
		expect(hand4).to.have.length(4);
	});
	it('after first time distribution there will be 16 cards left in deck',function(){
		expect(game.deck).to.have.length(16);
	})
});