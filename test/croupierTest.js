var m = require('../croupier.js').croupier;
var team = require('../team.js').team;
var d = require('../cards.js').m;
var g = require('../game.js').game;

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('calculateTotalPoint',function(){
	var teamBucket = [{player:'10.4.20.173_sayan',
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
						},
						{player:'10.4.20.173_sayan',
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
						},
						{player:'10.4.20.173_sayan',
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
	it('calculate TotalPoint of a team',function(){
		assert.equal(18,m.calculateTotalPoint(teamBucket));
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

describe('updateScore',function(){
	var game = new g.Game();
	var player1 = new team.Player('ramu');
	var player2 = new team.Player('raju');
	var player3 = new team.Player('ranju');
	var player4 = new team.Player('dhamu');
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	game.team_1.wonCards = [{player:'10.4.20.173_sayan',
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
						},
						{player:'10.4.20.173_sayan',
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
						},
						{player:'10.4.20.173_sayan',
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
	it('increases the score of the bidding team when they gain the bidding point',function() {
		game.bid = {value : 18, player : player2};
		m.updateScore(game);
		expect(game.team_1.score).to.equal(1);
	});

	it('increases the score of the bidding team when they gain more than the bidding point',function() {
		game.bid = {value : 17, player : player2};
		m.updateScore(game);
		expect(game.team_1.score).to.equal(2);
	});

	it('decreases the score of the bidding team when they gain less than the bidding point',function() {
		game.bid = {value : 19, player : player2};
		m.updateScore(game);
		expect(game.team_1.score).to.equal(1);
	});
});

describe('pairChecking', function() {
	var game = new g.Game();
	var player1 = new team.Player('ramu');
	var player2 = new team.Player('raju');
	var player3 = new team.Player('ranju');
	var player4 = new team.Player('dhamu');

	player1.hand = [{id: 'H7', name: '7', suit: 'Heart', point: 0, rank: 8 },
					{ id: 'DK', name: 'K', suit: 'Diamond', point: 0, rank: 5 },
					{ id: 'DJ', name: 'J', suit: 'Diamond', point: 3, rank: 1 },
					{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 } ];
	player2.hand = [{id: 'S7', name: '7', suit: 'Spade', point: 0, rank: 8 },
					{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 },
					{ id: 'CJ', name: 'J', suit: 'Club', point: 3, rank: 1 },
					{ id: 'H9', name: '9', suit: 'Heart', point: 2, rank: 2 } ];
	player3.hand = [{id: 'HK', name: 'K', suit: 'Heart', point: 0, rank: 5 },
					{ id: 'D10', name: '10', suit: 'Diamond', point: 1, rank: 4 },
					{ id: 'HQ', name: 'Q', suit: 'Heart', point: 0, rank: 6 },
					{ id: 'D7', name: '7', suit: 'Diamond', point: 0, rank: 8 } ];
	player4.hand = [{id: 'SK', name: 'K', suit: 'Spade', point: 0, rank: 5 },
					{ id: 'SQ', name: 'Q', suit: 'Spade', point: 0, rank: 6 },
					{ id: 'SJ', name: 'J', suit: 'Spade', point: 3, rank: 1 },
					{ id: 'SA', name: 'A', suit: 'Spade', point: 1, rank: 3 } ];
																	
	game.team_1.players = [player1,player2];
	game.team_2.players = [player3,player4];
	it('will set hasPair true for the player having trump suit pair', function() {
		game.trump = {suit: 'Heart', open: true};
		m.pairChecking(game);
		expect(game.team_2.players[0].hasPair).to.be.true;
	});
	it('will not set hasPair true for the player not having trump suit pair, but having pair of another suit', function() {
		game.trump = {suit: 'Heart', open: true};
		m.pairChecking(game);
		expect(game.team_2.players[1].hasPair).to.be.false;
	});
	it('will not set hasPair true for the player not having trump suit pair', function() {
		game.trump = {suit: 'Heart', open: true};
		m.pairChecking(game);
		expect(game.team_1.players[1].hasPair).to.be.false;
	});
});

describe('manipulateBidValueForPair',function() {
	var game;
	beforeEach(function(){
		game = new g.Game();
		var player1 = new team.Player('ramu');
		var player2 = new team.Player('raju');
		var player3 = new team.Player('ranju');
		var player4 = new team.Player('dhamu');

		player1.hand = [{id: 'H7', name: '7', suit: 'Heart', point: 0, rank: 8 },
						{ id: 'DK', name: 'K', suit: 'Diamond', point: 0, rank: 5 },
						{ id: 'DJ', name: 'J', suit: 'Diamond', point: 3, rank: 1 },
						{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 } ];
		player2.hand = [{id: 'S7', name: '7', suit: 'Spade', point: 0, rank: 8 },
						{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 },
						{ id: 'CJ', name: 'J', suit: 'Club', point: 3, rank: 1 },
						{ id: 'H9', name: '9', suit: 'Heart', point: 2, rank: 2 } ];
		player3.hand = [{id: 'HK', name: 'K', suit: 'Heart', point: 0, rank: 5 },
						{ id: 'D10', name: '10', suit: 'Diamond', point: 1, rank: 4 },
						{ id: 'HQ', name: 'Q', suit: 'Heart', point: 0, rank: 6 },
						{ id: 'D7', name: '7', suit: 'Diamond', point: 0, rank: 8 } ];
		player4.hand = [{id: 'SK', name: 'K', suit: 'Spade', point: 0, rank: 5 },
						{ id: 'SQ', name: 'Q', suit: 'Spade', point: 0, rank: 6 },
						{ id: 'SJ', name: 'J', suit: 'Spade', point: 3, rank: 1 },
						{ id: 'SA', name: 'A', suit: 'Spade', point: 1, rank: 3 } ];
																		
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
	});

	it('fixes the bid value to 16, when a player of bid winning team has royal pair and bid bid value will be less than 21', function() {
		game.bid.value = 19;
		game.trump = {suit: 'Heart', open: true};
		var bidWinningTeam = 'team_2';
		var opponentTeam = 'team_1';
		m.pairChecking(game);
		m.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
		expect(game.bid .value).to.be.equal(16);
	});
	it('decreases the bid value by 4, when a player of bid winning team has royal pair and bid bid value will be more than 20', function() {
		game.bid.value = 23;
		game.trump = {suit: 'Heart', open: true};
		var bidWinningTeam = 'team_2';
		var opponentTeam = 'team_1';
		m.pairChecking(game);
		m.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
		expect(game.bid .value).to.be.equal(19);
	});
	it('increases the bid value by 4, when a player of opponent team has royal pair and bid bid value will be less than 24', function() {
		game.bid.value = 19;
		game.trump = {suit: 'Heart', open: true};
		var bidWinningTeam = 'team_1';
		var opponentTeam = 'team_2';
		m.pairChecking(game);
		m.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
		expect(game.bid .value).to.be.equal(23);
	});
	it('fixes the bid value to 28, when a player of opponent team has royal pair and bid bid value will be more than 23', function() {
		game.bid.value = 26;
		game.trump = {suit: 'Heart', open: true};
		var bidWinningTeam = 'team_1';
		var opponentTeam = 'team_2';
		m.pairChecking(game);
		m.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
		expect(game.bid .value).to.be.equal(28);
	});
	it('does not change the bid value when, both team do not have royal pair', function() {
		game.bid.value = 20;
		game.trump = {suit: 'Club', open: true};
		var bidWinningTeam = 'team_1';
		var opponentTeam = 'team_2';
		m.pairChecking(game);
		m.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
		expect(game.bid .value).to.be.equal(20);
	});
});

