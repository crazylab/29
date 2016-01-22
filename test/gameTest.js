var Game = require('../lib/game');
var Player = require('../lib/player');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var deck = {
	getCards : sinon.stub.returns([1,2,3]),
	drawFourCards : sinon.stub().returns([
		{id: 'A', rank: 3, suit: 'Heart'},
		{id: 'B', rank: 3, suit: 'Heart'},
		{id: 'C', rank: 3, suit: 'Heart'},
		{id: 'D', rank: 3, suit: 'Heart'}]),
	recollectCards : function(){},
	cardsCount : function(){}
}
describe('Game', function(){
	describe('setDistributionSequence',function(){
		var game;
		beforeEach(function(){
			game = new Game(deck);
			game.team_1.players = ['peter','john'];
			game.team_2.players = ['ramu','ritam'];
		});
		it('at first distribution sequence will be empty',function(){
			expect(game.distributionSequence).to.be.empty;
		});
		it('set distribution sequence first time',function(){
			game.setDistributionSequence();
			expect(game.distributionSequence).to.have.length(4);
			expect(game.distributionSequence).to.deep.equal(['peter','ramu','john','ritam']);
		});
		it('set distribution sequence second time',function(){
			game.setDistributionSequence();
			game.setDistributionSequence();
			expect(game.distributionSequence).to.have.length(4);
			expect(game.distributionSequence).to.deep.equal(['ramu','john','ritam','peter']);
		});
	});

	describe('getStatus',function(){
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');

		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.distributionSequence = [player1,player3,player2,player4];

		game.distributeCards();
		game.playedCards = [{player:'ramu',
							card:{ id:'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'raju',
							card:{ id:'S10', name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							},
							{player:'peter',
							card:{ id:'S8', name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'dhamu',
							card:{ id:'HA', name: 'A', suit: 'Heart', point: 1, rank: 3 },
							trumpShown: true
							}];
		var status = game.getStatus('peter');
		it('gives four card IDs for the requested player',function(){
			expect(status.me.hand).to.have.length(4);
		});
		it('gives 4 cards for the 3 other player',function(){
			expect(status.partner.hand).to.equal(4);
			expect(status.opponent_1.hand).to.equal(4);
			expect(status.opponent_2.hand).to.equal(4);
		});
		it('gives all the cards that has already been played by a player',function(){
			expect(status.playedCards[0].card.id).to.equal('HJ');
			expect(status.playedCards[1].card.id).to.equal('S10');
			expect(status.playedCards[2].card.id).to.equal('S8');
			expect(status.playedCards[3].card.id).to.equal('HA');
		});
	});

	describe('getPlayer',function(){
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');

		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		it('gives the requested player',function(){
			var playerId = 'peter';
			expect(game.getPlayer(playerId)).to.deep.equal(player3);
		});
	});

	describe('setRoundSequence',function(){
		var game = new Game(deck);
		var p1 = new Player('raju');
		var p2 = new Player('ramu');
		var p3 = new Player('raka');
		var p4 = new Player('rahul');
		game.team_1.players = [p1,p3];
		game.team_2.players = [p2,p4];
		game.setDistributionSequence();
		game.setRoundSequence();
		it('initially roundSequence is equal to distribution sequence',function(){
			expect(game.roundSequence).to.deep.equal(game.distributionSequence);
		});
		it('initially first player of roundSequence has turn true',function(){
			expect(game.roundSequence[0].turn).to.be.true;
		});
		it('gives the roundSequence depending upon the round winner',function(){
			game.setRoundSequence('ramu');
			expect(game.roundSequence).to.deep.equal([p2,p3,p4,p1]);

			game.setRoundSequence('rahul');
			expect(game.roundSequence).to.deep.equal([p4,p1,p2,p3]);
		});
		it('all time first player of roundSequence has turn true', function(){
			expect(game.roundSequence[0].turn).to.be.true;
		});
	});

	describe('nextTurn',function(){
		it('gives the trun permission true of the next player',function(){
			var game = new Game(deck);
			var p1 = new Player('raju');
			var p2 = new Player('ramu');
			var p3 = new Player('raka');
			var p4 = new Player('rahul');
			game.team_1.players = [p1,p3];
			game.team_2.players = [p2,p4];
			game.setDistributionSequence();
			game.setRoundSequence();
			game.nextTurn();
			expect(game.roundSequence[0].turn).to.be.false;
			expect(game.roundSequence[1].turn).to.be.true;
			expect(game.roundSequence[2].turn).to.be.false;
			expect(game.roundSequence[3].turn).to.be.false;

			game.nextTurn();
			expect(game.roundSequence[0].turn).to.be.false;
			expect(game.roundSequence[1].turn).to.be.false;
			expect(game.roundSequence[2].turn).to.be.true;
			expect(game.roundSequence[3].turn).to.be.false;
		});
		it('turns the permission on for the player who won previous round after the round completes',function(){
			var game = new Game(deck);
			var p1 = new Player('raju');
			var p2 = new Player('ramu');
			var p3 = new Player('raka');
			var p4 = new Player('rahul');
			game.team_1.players = [p1,p2];
			game.team_2.players = [p3,p4];
			game.roundWinner = sinon.stub().returns('ramu');
			game.setDistributionSequence();
			game.playedCards = [{player:'raja',
							card:{ id:'H8', name: '8', suit: 'Heart', point: 0, rank: 7 },
							trumpShown: false
							},
							{player:'raka',
							card:{ id:'S10', name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ id:'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'rahul',
							card:{ id:'HA', name: 'A', suit: 'Heart', point: 1, rank: 3 },
							trumpShown: false
							}]
			game.roundSequence = [p1,p3,p2,p4];
			game.team_2.players[1].turn = true;
			game.nextTurn();
			expect(game.team_1.players[1].turn).to.be.true;
			expect(game.team_2.players[1].turn).to.be.false;
		});
	});
	describe('setBidWinner',function(){
		var game = new Game(deck);
		var player = {id : '123',
						hand : {
							Heart : [],
							Spade : [],
							Club : [],
							Diamond : [],
							},
						hasPair : false
		}
		game.setBidWinner(16,player);

		it('sets the value of the highest bid as bid value',function(){
			expect(game.getBid().value).to.not.equal(null);
		});

		it('sets the player who has bid the maximum',function(){
			expect(game.bid.player).to.not.equal(null);

		});
	});

	describe('getFinalBidStatus',function(){
		var game = new Game(deck);
		var p1 = new Player('raju');
		var p2 = new Player('ramu');
		var p3 = new Player('raka');
		var p4 = new Player('bp');
		game.team_1.players = [p1,p2];
		game.team_2.players = [p3,p4];
		game.distributionSequence = [p1, p3, p2, p4];
		game.setBidWinner(16, p3);
		it('gets the highest bidder according to the relation with requested player',function(){
			var bidStatus = game.getFinalBidStatus('raju');
			expect(bidStatus.player).to.equal('right');

			bidStatus = game.getFinalBidStatus('ramu');
			expect(bidStatus.player).to.equal('left');

			bidStatus = game.getFinalBidStatus('raka');
			expect(bidStatus.player).to.equal('you');

			bidStatus = game.getFinalBidStatus('bp');
			expect(bidStatus.player).to.equal('partner');

		});
		it('gets the bid value which has already fixed',function(){
			var bidStatus = game.getFinalBidStatus('raka');
			expect(bidStatus.value).to.equal(16);
		});
	});

	describe('isValidCardToThrow',function(){
		var game;
		beforeEach(function(){
			game = new Game(deck);
			var p1 = new Player('raju');
			var p2 = new Player('ramu');
			var p3 = new Player('raka');
			var p4 = new Player('rahul');
			p1.hand = [
								{ id: 'H10', name: '10', suit: 'Heart', point: 1, rank: 4 },
		  						{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 },
								{ id: 'C8', name: '8', suit: 'Club', point: 0, rank: 7 },
		 						{ id: 'C7', name: '7', suit: 'Club', point: 0, rank: 8 }
		 				];
			game.team_1.players = [p1,p3];
			game.team_2.players = [p2,p4];
		});
		it('allows a player to play any card of his hand when playedCards bucket is empty',function(){
			expect(game.isValidCardToThrow('S9',game.team_1.players[0].hand)).to.be.true;
		});
		it('only allows a player to play the running suit if he has that suit',function(){

			game.playedCards = [{card:{ id: 'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 }},
								{card:{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 }}];
			expect(game.isValidCardToThrow('H10',game.team_1.players[0].hand)).to.be.true;
			expect(game.isValidCardToThrow('S9',game.team_1.players[0].hand)).to.be.false;
		});
		it('allows a player to play any card of his hand if his hand doesn\'t contain running suit',function(){
			game.playedCards = [{card:{ id: 'DJ', name: 'J', suit: 'Diamond', point: 3, rank: 1 }},
								{card:{ id: 'C9', name: '9', suit: 'Club', point: 2, rank: 2 }}];
			expect(game.isValidCardToThrow('C8',game.team_1.players[0].hand)).to.be.true;
		});
		it('doesn\'t allow a player to play any suit card rathar than trump suit card, if he revel trump suit and he has trump suit in hand in that round',function(){
			var game = new Game(deck);
			var player1 = new Player('ramu');
			var player2 = new Player('raju');
			var player3 = new Player('peter');
			var player4 = new Player('dhamu');

			game.team_1.players = [player1,player2];
			game.team_2.players = [player3,player4];
			game.trump = {
				suit : 'D2',
				open : true
			};
			game.playedCards = [{player:'ramu',
							card:{ id:'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'raka',
							card:{ id:'S10', name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							}];
			var hand = [
								{ id: 'H10', name: '10', suit: 'Heart', point: 1, rank: 4 },
		  						{ id: 'S9', name: '9', suit: 'Spade', point: 2, rank: 2 },
								{ id: 'D8', name: '8', suit: 'Diamond', point: 0, rank: 7 },
		 						{ id: 'C7', name: '7', suit: 'Club', point: 0, rank: 8 }
		 				];
			expect(game.isValidCardToThrow('S9',hand)).to.be.false;
			expect(game.isValidCardToThrow('H10',hand)).to.be.false;
			expect(game.isValidCardToThrow('D8',hand)).to.be.true;

		})
	});

	describe('getRelationship',function(){
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');

		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.distributionSequence = [player1, player3, player2, player4];
		it('gets the relationship from a player\'s view',function(){
			var relation = game.getRelationship('ramu');
			var expectedRelation = {
				team : game.team_1,
				me : player1,
				partner : player2,
				opponentTeam : game.team_2,
				opponent_1 : player3,
				opponent_2 : player4
			};
			expect(relation).to.deep.equal(expectedRelation);
		});
	});

	describe("ableToAskForTrumpSuit",function(){
		it("prevents a player to see the trump suit if the player has the running suit",function(){
			var game = new Game(deck);
			game.playedCards = [{player:'ramu',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'peter',
							card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
							trumpShown: false
							}];

			var playerHand = [{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							{ name: '9', suit: 'Club', point: 2, rank: 2 },
							{ name: '7', suit: 'Diamond', point: 0, rank: 8 }];

			var expectedResult = game.ableToAskForTrumpSuit(playerHand);
			expect(expectedResult).to.be.false;
		});

		it("prevents a player to see the trump suit if he is the first player of the round",function(){
			var game = new Game(deck);
			game.playedCards = [];
			var playerHand = [{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							{ name: '9', suit: 'Club', point: 2, rank: 2 },
							{ name: '7', suit: 'Diamond', point: 0, rank: 8 }];

			var expectedResult = game.ableToAskForTrumpSuit(playerHand);
			expect(expectedResult).to.be.false;
		});

		it("allows a player to see the trump suit if the player doesn't have the running suit",function(){
			var game = new Game(deck);
			game.playedCards = [{player:'ramu',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'peter',
							card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
							trumpShown: false
							}];

			var playerHand = [{ name: '7', suit: 'Diamond', point: 0, rank: 8 },
							{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							{ name: '7', suit: 'Spade', point: 0, rank: 8 },
							{ name: '7', suit: 'Diamond', point: 0, rank: 8 }];

			var expectedResult = game.ableToAskForTrumpSuit(playerHand);
			expect(expectedResult).to.be.true;
		});
	});

	describe('distributeCards',function(){
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.setDistributionSequence();
		game.distributeCards();
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
	});

	describe('addPlayer',function(){
		it('assigns a player to team_1 when there are no player in both the team',function(){
			var game = new Game(deck);
			var player = 'Ramu';
			game.addPlayer(player);
			expect(game.team_1.players).to.have.length(1);
			expect(game.team_2.players).to.have.length(0);
			expect(game.team_1.players[0].id).to.equal('Ramu');
		});
		it('assigns a player in team_2 when team_1 has two players and team_2 has no player',function(){
			var game = new Game(deck);
			game.team_1.players.push('ramu');
			game.team_1.players.push('raju');

			var player = 'Shibu';
			game.addPlayer(player);
			expect(game.team_1.players).to.have.length(2);
			expect(game.team_2.players).to.have.length(1);
			expect(game.team_2.players[0].id).to.equal('Shibu');
		});
		it('returns false when four players are already filled', function(){
			var game = new Game();
			game.addPlayer('ramu');
			game.addPlayer('peter');
			game.addPlayer('john');
			game.addPlayer('haru');

			expect(game.addPlayer('dhanus')).to.equal.false;
		});

	});
	describe('playerCount',function(){
		it('counts the number of player a game has',function(){
			var game = new Game(deck);
			game.team_1 = {players : ['Ramu','Mamu']},
			game.team_2 = {players : ['Dada']}

			expect(game.playerCount(game)).to.equal(3);
		});
		it('gives zero when there is no player',function(){
			var game = new Game(deck);
			game.team_1 = {players : []},
			game.team_2 = {players : []}
			expect(game.playerCount(game)).to.equal(0);
		});
	});
	describe('gameInitializer',function(){
		it('sets the game after one game finish for next deal',function(){
			var game = new Game(deck);
			game.distributionSequence = ['peter','john','ramu','savio'];
			game.team_1.players=['peter','ramu'];
			game.team_2.players=['john','savio']

			game.team_1.wonCards = [{player:'peter',
						card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
						trumpShown: false
						},
						{player:'ramu',
						card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
						trumpShown: false
						},
						{player:'savio',
						card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'peter',
						card:{ name: '7', suit: 'Spade', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
						trumpShown: false
						},
						{player:'ramu',
						card:{ name: 'J', suit: 'Spade', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'savio',
						card:{ name: '9', suit: 'Spade', point: 2, rank: 2 },
						trumpShown: false
						},
						{player:'peter',
						card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'ramu',
						card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
						trumpShown: true
						},
						{player:'savio',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: true
						}];
			game.team_2.wonCards =
			[
				{player:'peter',
				card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
				trumpShown: false
				},
				{player:'john',
				card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
				trumpShown: false
				},
				{player:'ramu',
				card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
				trumpShown: false
				},
				{player:'savio',
				card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
				trumpShown: false
				}
			];
			game.bid = {value:19, player:'peter'};
			// game.deck = [];
			game.trump = {suit: 'Heart', open: true};
			game.team_2.score = 1;

			game.gameInitializer();

			// expect(game.deck).to.have.length(16);
			assert.deepEqual(game.distributionSequence,['john','ramu','savio','peter']);
			expect(game.team_1.wonCards).to.have.length(0);
			expect(game.team_2.wonCards).to.have.length(0);
			assert.deepEqual(game.bid.value,0);
			assert.deepEqual(game.bid.player,undefined);
			expect(game.bid.passed).to.be.length(0);
			assert.deepEqual(game.trump, {suit: undefined, open: false});
			expect(game.team_1.score).to.be.equal(0);
			expect(game.team_2.score).to.be.equal(1);

		});
	});

	describe('calculateTotalPointOfBidWinningTeam',function(){
		var game = new Game(deck);
		var player1 = new Player('peter');
		var player2 = new Player('john');
		var player3 = new Player('ramu');
		var player4 = new Player('savio');
		game.team_1.players=[player1,player2];
		game.team_2.players=[player3,player4];
		game.bid.player = 'peter';
		game.team_1.wonCards = [{player:'peter',
						card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
						trumpShown: false
						},
						{player:'ramu',
						card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
						trumpShown: false
						},
						{player:'savio',
						card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'peter',
						card:{ name: '7', suit: 'Spade', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
						trumpShown: false
						},
						{player:'ramu',
						card:{ name: 'J', suit: 'Spade', point: 3, rank: 1 },
						trumpShown: false
						},
						{player:'savio',
						card:{ name: '9', suit: 'Spade', point: 2, rank: 2 },
						trumpShown: false
						},
						{player:'peter',
						card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
						trumpShown: false
						},
						{player:'john',
						card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
						trumpShown: true
						},
						{player:'ramu',
						card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
						trumpShown: true
						},
						{player:'savio',
						card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
						trumpShown: true
						}];
		it('calculate TotalPoint of a team',function(){
			assert.equal(18,game.calculateTotalPointOfBidWinningTeam());
		});

	});

	describe('roundWinner',function(){
		var game = new Game(deck);
		it('gives the id of the player who won the round before trumpShown',function(){
			var playedCardsSet_1 = [{player:'peter',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
							trumpShown: false
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
							trumpShown: false
							}];
			var playedCardsSet_2 = [{player:'peter',
								card:{ name: '7', suit: 'Spade', point: 0, rank: 8 },
								trumpShown: false
								},
								{player:'john',
								card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
								trumpShown: false
								},
								{player:'ramu',
								card:{ name: 'J', suit: 'Spade', point: 3, rank: 1 },
								trumpShown: false
								},
								{player:'savio',
								card:{ name: '9', suit: 'Spade', point: 2, rank: 2 },
								trumpShown: false
								}];
			var playedCardsSet_3 = [{player:'peter',
							card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ name: 'J', suit: 'Spade', point: 3, rank: 2 },
							trumpShown: false
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							}];
			game.playedCards = playedCardsSet_1;
			assert.equal('savio',game.roundWinner());
			game.playedCards = playedCardsSet_2;

			assert.equal('ramu',game.roundWinner());
			game.playedCards = playedCardsSet_3;

			assert.equal('peter',game.roundWinner());

		});
		it('gives the id of the player who won the round after trumpShown',function(){
			var playedCardsSet_1 = [{player:'peter',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
							trumpShown: true
							}];
			var playedCardsSet_2 = [{player:'peter',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'A', suit: 'Heart', point: 1, rank: 3 },
							trumpShown: true
							}];
			var playedCardsSet_3 = [{player:'peter',
							card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: true
							}];
			var playedCardsSet_4 = [{player:'peter',
							card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: true
							}];
			var playedCardsSet_5 = [{player:'peter',
							card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							trumpShown: true
							},
							{player:'john',
							card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: true
							}];
			var playedCardsSet_6 = [{player:'peter',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: true
							},
							{player:'john',
							card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
							trumpShown: true
							}];
			var playedCardsSet_7 = [{player:'peter',
							card:{ name: 'K', suit: 'Club', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'john',
							card:{ name: 'Q', suit: 'Heart', point: 0, rank: 6 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							}];
			var playedCardsSet_8 = [{player:'peter',
							card:{ name: 'K', suit: 'Club', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'john',
							card:{ name: 'Q', suit: 'Heart', point: 0, rank: 6 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: 'K', suit: 'Heart', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							}];
			game.playedCards = playedCardsSet_2;
			game.trump = {suit:'Spade'};
			assert.equal('ramu',game.roundWinner(playedCardsSet_2,'Spade'));
			game.playedCards = playedCardsSet_5;
			game.trump = {suit:'Club'};
			assert.equal('savio',game.roundWinner(playedCardsSet_5,'Club'));
			game.playedCards = playedCardsSet_6;
			game.trump = {suit:'Diamond'};
			assert.equal('john',game.roundWinner(playedCardsSet_6,'Diamond'));
			game.playedCards = playedCardsSet_1;

			assert.equal('john',game.roundWinner(playedCardsSet_1,'Diamond'));
			game.playedCards = playedCardsSet_3;

			assert.equal('john',game.roundWinner(playedCardsSet_3,'Diamond'));
			game.playedCards = playedCardsSet_4;

			assert.equal('ramu',game.roundWinner(playedCardsSet_4,'Diamond'));
			game.trump = {suit:'Heart'};

			game.playedCards = playedCardsSet_7;

			assert.equal('john',game.roundWinner(playedCardsSet_7,'Heart'));
			game.playedCards = playedCardsSet_8;

			assert.equal('ramu',game.roundWinner(playedCardsSet_8,'Heart'));
		});
	});

	describe('updateScore',function(){
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');
		game.trump.open = true;
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.team_1.wonCards = [{player:'peter',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
							trumpShown: false
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'peter',
							card:{ name: '7', suit: 'Spade', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
							trumpShown: false
							},
							{player:'ramu',
							card:{ name: 'J', suit: 'Spade', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'savio',
							card:{ name: '9', suit: 'Spade', point: 2, rank: 2 },
							trumpShown: false
							},
							{player:'peter',
							card:{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							trumpShown: false
							},
							{player:'john',
							card:{ name: '9', suit: 'Diamond', point: 2, rank: 2 },
							trumpShown: true
							},
							{player:'ramu',
							card:{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							trumpShown: true
							},
							{player:'savio',
							card:{ name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: true
							}];
		it('increases the score of the bidding team when they gain the bidding point',function() {
			game.bid = {value : 18, player : 'raju'};
			game.updateScore();
			expect(game.team_1.score).to.equal(1);
		});

		it('increases the score of the bidding team when they gain more than the bidding point',function() {
			game.bid = {value : 17, player : 'raju'};
			game.updateScore();
			expect(game.team_1.score).to.equal(2);
		});

		it('decreases the score of the bidding team when they gain less than the bidding point',function() {
			game.bid = {value : 19, player : 'raju'};
			game.updateScore();
			expect(game.team_1.score).to.equal(1);
		});
	});

	describe('manipulateBidValueForPair',function() {
		var game;
		beforeEach(function(){
			game = new Game(deck);
			var player1 = new Player('ramu');
			var player2 = new Player('raju');
			var player3 = new Player('peter');
			var player4 = new Player('dhamu');

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

		it('fixes the bid value to 16, when a player of bid winning team has royal pair and bid value will be less than 21', function() {
			game.bid={value : 19, player : 'dhamu'};
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking();
			game.manipulateBidValueForPair();
			expect(game.bid .value).to.be.equal(16);
		});
		it('decreases the bid value by 4, when a player of bid winning team has royal pair and bid value will be more than 20', function() {
			game.bid={value : 23, player : 'dhamu'};
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking(game);
			game.manipulateBidValueForPair();
			expect(game.bid .value).to.be.equal(19);
		});
		it('increases the bid value by 4, when a player of opponent team has royal pair and bid value will be less than 24', function() {
			game.bid={value : 19, player : 'ramu'};
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking();
			game.manipulateBidValueForPair();
			expect(game.bid .value).to.be.equal(23);
		});
		it('fixes the bid value to 28, when a player of opponent team has royal pair and bid bid value will be more than 23', function() {
			game.bid={value : 26, player : 'raju'};
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking();
			game.manipulateBidValueForPair();
			expect(game.bid .value).to.be.equal(28);
		});
		it('does not change the bid value when, both team do not have royal pair', function() {
			game.bid={value : 20, player : 'raju'};
			game.trump = {suit: 'Club', open: true};
			game.pairChecking();
			game.manipulateBidValueForPair();
			expect(game.bid .value).to.be.equal(20);
		});
	});

	describe('pairChecking', function() {
		var game = new Game(deck);
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('peter');
		var player4 = new Player('dhamu');

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
			game.pairChecking();
			expect(game.team_2.players[0].hasPair).to.be.true;
			expect(game.team_2.players[1].hasPair).to.be.false;
		});
		it('will not set hasPair true for the player not having trump suit pair, but having pair of another suit', function() {
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking();
			expect(game.team_2.players[1].hasPair).to.be.false;
		});
		it('will not set hasPair true for the player not having trump suit pair', function() {
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking();
			expect(game.team_1.players[1].hasPair).to.be.false;
		});
	});

	describe('setTrumpSuit',function(){
		it('sets the trump suit based on the given suit',function(){
			var game = new Game(deck);
			game.setRoundSequence = sinon.spy();
			game.setTrumpSuit('H2');
			expect(game.trump.suit).to.be.equal('H2');
		});
	});

	describe('getTrumpSuit',function(){
		it('gives the trump suit when player requests for it',function(){
			var game = new Game(deck);
			game.trump = {suit : 'H2', open : 'false'};
			var trump = game.getTrumpSuit();
			expect(trump).to.be.equal('H2');
			expect(game.trump.open).to.equal.true;
		});
	});
	describe('bid',function(){


		describe('getCurrentBidder',function(){
			var game;
			beforeEach(function(){
				game = new Game(deck);
				var player1 = new Player('ramu');
				var player2 = new Player('raju');
				var player3 = new Player('peter');
				var player4 = new Player('dhamu');
				game.team_1.players = [player1,player2];
				game.team_2.players = [player3,player4];
			});
			it('it sets the leading and the lagging bidder at the start of the game and returns the current bidder',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				expect(game.getCurrentBidder()).to.be.equal('ramu');
				expect(game.bid.turn.lagging).to.be.equal('peter');

			});
			it('gives lagging player after leading player bid', function(){
				game.bid = {
					trump : undefined,
					player : 'ramu',
					turn : {
						leading : 'ramu',
						lagging : 'peter'
					},
					pass : []
				};
				game.setDistributionSequence();
				expect(game.getCurrentBidder()=='peter');
			});
			it('gives leading player after lagging player bid', function(){
				game.bid = {
					trump : undefined,
					player : 'peter',
					turn : {
						leading : 'ramu',
						lagging : 'peter'
					},
					pass : []
				};
				game.setDistributionSequence();
				expect(game.getCurrentBidder()=='ramu');
			});
		});

		describe('giveTurnToAnotherForBidding',function(){
			var game;
			beforeEach(function(){
				game = new Game(deck);
				var player1 = new Player('ramu');
				var player2 = new Player('raju');
				var player3 = new Player('peter');
				var player4 = new Player('dhamu');
				game.team_1.players = [player1,player2];
				game.team_2.players = [player3,player4];
			});

			it('gives the turn to the next player for bidding when the leading bidder passes', function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.giveTurnToAnotherForBidding();

				expect(game.bid.passed).to.be.length(1);
				expect(game.bid.passed[0]).to.be.equal('ramu');
				expect(game.bid.turn.lagging).to.be.equal('raju');
				expect(game.bid.turn.leading).to.be.equal('peter');

			});
			it('gives the turn to the next player for bidding when the lagging bidder passes', function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.passed = ['peter'];
				game.bid.player = 'ramu';
				game.bid.turn.lagging = 'raju';

				game.giveTurnToAnotherForBidding();

				expect(game.bid.passed).to.be.length(2);
				assert.deepEqual(game.bid.passed , ['peter','raju']);
				expect(game.bid.turn.lagging).to.be.equal('dhamu');
				expect(game.bid.turn.leading).to.be.equal('ramu');
				expect(game.bid.value).to.be.equal(0);

			});

			it('sets the leading\'s and lagging\'s turn undefined', function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.passed = ['peter','raju'];
				game.bid.player = 'ramu';
				game.bid.value = 17;
				game.bid.turn.lagging = 'dhamu';

				game.giveTurnToAnotherForBidding();

				expect(game.bid.passed).to.be.length(3);
				assert.deepEqual(game.bid.passed , ['peter','raju','dhamu']);
				expect(game.bid.turn.lagging).to.be.equal(undefined);
				expect(game.bid.turn.leading).to.be.equal(undefined);

			});

			it('sets the bid value to 16 if all the players pass without bidding', function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.passed = ['peter','raju'];
				game.bid.player = 'ramu';
				game.bid.turn.lagging = 'dhamu';

				game.giveTurnToAnotherForBidding();

				expect(game.bid.passed).to.be.length(3);
				assert.deepEqual(game.bid.passed , ['peter','raju','dhamu']);
				expect(game.bid.turn.lagging).to.be.equal(undefined);
				expect(game.bid.turn.leading).to.be.equal(undefined);
				expect(game.bid.value).to.be.equal(16);
			});

		});

		describe('updateBidValueAndPlayer',function(){
			var game;
			beforeEach(function(){
				game = new Game(deck);
				var player1 = new Player('ramu');
				var player2 = new Player('raju');
				var player3 = new Player('peter');
				var player4 = new Player('dhamu');
				game.team_1.players = [player1,player2];
				game.team_2.players = [player3,player4];
			});

			it('sets the bid value and player when a leading bidder bids',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.updateBidValueAndPlayer(17,'ramu');

				expect(game.getCurrentBidder()).to.be.equal('peter');
				expect(game.bid.value).to.be.equal(17);
				expect(game.bid.player).to.be.equal('ramu');
			});

			it('sets the bid value and player when a lagging bidder bids',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.player = 'ramu';
				game.bid.value = 17;
				game.updateBidValueAndPlayer(18,'peter');

				expect(game.getCurrentBidder()).to.be.equal('ramu');
				expect(game.bid.value).to.be.equal(18);
				expect(game.bid.player).to.be.equal('peter');
			});
			it('does not set the bid value and player when a lagging player bids the same value as leading player',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.player = 'ramu';
				game.bid.value = 17;
				game.updateBidValueAndPlayer(17,'peter');

				expect(game.getCurrentBidder()).to.be.equal('peter');
				expect(game.bid.value).to.be.equal(17);
				expect(game.bid.player).to.be.equal('ramu');
			});

			it('lets a leading player bid the same value as lagging player',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.player = 'raju';
				game.bid.value = 18;
				game.bid.passed = ['peter'];
				game.bid.turn.lagging = 'raju';
				game.updateBidValueAndPlayer(18,'ramu');

				expect(game.getCurrentBidder()).to.be.equal('raju');
				expect(game.bid.value).to.be.equal(18);
				expect(game.bid.player).to.be.equal('ramu');
			});

		});

		describe('setBid',function(){
			var game;
			beforeEach(function(){
				game = new Game(deck);
				var player1 = new Player('ramu');
				var player2 = new Player('raju');
				var player3 = new Player('peter');
				var player4 = new Player('dhamu');
				game.team_1.players = [player1,player2];
				game.team_2.players = [player3,player4];
			});
			it('sets the bid value when the leading player bids',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.setBid('ramu',17);
				expect(game.getCurrentBidder()).to.be.equal('peter');
				expect(game.bid.value).to.be.equal(17);
				expect(game.bid.player).to.be.equal('ramu');

				expect(game.bid.turn.leading).to.be.equal('ramu');
				expect(game.bid.turn.lagging).to.be.equal('peter');
			});

			it('sets the bid value when the lagging player bids higher than the leading player',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.passed = ['peter'];
				game.bid.player = 'ramu';
				game.bid.value = 17;
				game.bid.turn.lagging = 'raju';
				game.setBid('raju',19);
				expect(game.getCurrentBidder()).to.be.equal('ramu');
				expect(game.bid.value).to.be.equal(19);
				expect(game.bid.player).to.be.equal('raju');

				expect(game.bid.turn.leading).to.be.equal('ramu');
				expect(game.bid.turn.lagging).to.be.equal('raju');
			});

			it('gives the next player to bid if the leading player passes',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.setBid('ramu','Pass');

				expect(game.getCurrentBidder()).to.be.equal('peter');
				expect(game.bid.value).to.be.equal(0);
				expect(game.bid.player).to.be.equal(undefined);

				expect(game.bid.turn.leading).to.be.equal('peter');
				expect(game.bid.turn.lagging).to.be.equal('raju');
			});

			it('does nothing if the lagging player bids lesser value than the bid value',function(){
				game.setDistributionSequence();
				game.setBidderTurn();
				game.bid.passed = ['peter'];
				game.bid.player = 'ramu';
				game.bid.value = 17;
				game.bid.turn.lagging = 'raju';
				game.setBid('raju',16);
				expect(game.getCurrentBidder()).to.be.equal('raju');
				expect(game.bid.value).to.be.equal(17);
				expect(game.bid.player).to.be.equal('ramu');

				expect(game.bid.turn.leading).to.be.equal('ramu');
				expect(game.bid.turn.lagging).to.be.equal('raju');
			});

		});


	});

	describe('setAllPlayersTurnFalse',function(){
		it('sets every player\'s turn false',function(){
				var game = new Game(deck);
				var player1 = new Player('ramu');
				var player2 = new Player('raju');
				var player3 = new Player('peter');
				var player4 = new Player('dhamu');
				game.team_1.players = [player1,player2];
				game.team_2.players = [player3,player4];

				game.team_1.players[0].turn = true;
				game.setAllPlayersTurnFalse();

				expect(game.team_1.players[0].turn).to.be.false;
		});
	});

	describe('handleCompletionOfRound',function(){
		it('it starts a new game when eight rounds are completed',function(){
			var game = new Game(deck);
			var player1 = new Player('ramu');
			var player2 = new Player('raju');
			var player3 = new Player('peter');
			var player4 = new Player('dhamu');
			game.team_1.players = [player1,player2];
			game.team_2.players = [player3,player4];

			game.isGameFinished = sinon.stub().returns(true);
			game.startNewRound = sinon.stub().returns(true);

			game.handleCompletionOfRound();

		});

	});

	describe('getPlayedCards', function(){
		var game;
		beforeEach(function(){
			game = new Game(deck);
			game.playedCards = [
				{ player: 'X', card: 'J' },
				{ player: 'M', card: 'Q' },
				{ player: 'Y', card: 'K' },
				{ player: 'N', card: 'A' }
			];
			var relation = {
				me : {id: 'Y'},
				partner : {id: 'X'},
				opponent_1 : {id: 'N'},
				opponent_2 : {id: 'M'}
			};
			game.getRelationship = sinon.stub().returns(relation);
		});
		it('gives the played cards according to the playing order with relation to the player', function(){
			var playedCards = game.getPlayedCards('Y');
			expect(playedCards[0].relation).to.equal('partner');
			expect(playedCards[1].relation).to.equal('left');
			expect(playedCards[2].relation).to.equal('you');
			expect(playedCards[3].relation).to.equal('right');
		});
	});
	describe('whoAreYou', function(){
	    it('gives the relation with other player', function(){
	        var game = new Game(deck);
			var p1 = new Player('raju');
			var p2 = new Player('ramu');
			var p3 = new Player('raka');
			var p4 = new Player('rahul');
			game.team_1.players = [p1,p2];
			game.team_2.players = [p3,p4];
			game.distributionSequence = [p1, p3, p2, p4];
			expect(game.whoAreYou('ramu','ramu')).to.equal('you');
			expect(game.whoAreYou('raju','ramu')).to.equal('partner');
			expect(game.whoAreYou('raka','ramu')).to.equal('left');
			expect(game.whoAreYou('rahul','ramu')).to.equal('right');
	    });
	});
});
