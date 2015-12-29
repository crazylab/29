var Game = require('../lib/game');
var Player = require('../lib/player');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Game', function(){ 

	describe('setDistributionSequence',function(){
		var game;
		beforeEach(function(){
			game = new Game();
			game.team_1.players = [1,2];
			game.team_2.players = [3,4];
		});
		it('at first distribution sequence will be empty',function(){
			expect(game.distributionSequence).to.be.empty;
		});
		it('set distribution sequence first time',function(){
			game.setDistributionSequence();
			expect(game.distributionSequence).to.have.length(4);
			expect(game.distributionSequence).to.deep.equal([1,3,2,4]);
		});
	});

	describe('getStatus',function(){
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
		var player4 = new Player('dhamu');
		
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.distributionSequence = [player1,player3,player2,player4];
		
		game.distributeCards(game);
		game.playedCards = [{player:'ramu',
							card:{ id:'HJ', name: 'J', suit: 'Heart', point: 3, rank: 1 },
							trumpShown: false
							},
							{player:'raju',
							card:{ id:'S10', name: '10', suit: 'Spade', point: 1, rank: 4 },
							trumpShown: false
							},
							{player:'ranju',
							card:{ id:'S8', name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'dhamu',
							card:{ id:'HA', name: 'A', suit: 'Heart', point: 1, rank: 3 },
							trumpShown: true
							}];
		var status = game.getStatus('ranju');
		it('gives object with ownHand and length of partner, opponent_1, opponent_2 hand',function(){
			expect(status).to.have.all.keys('me', 'partner', 'opponent_1', 'opponent_2','trump','bid','playedCards',"isBidWinner","score");
		});
		it('gives four card IDs for the requested player',function(){
			expect(status.me.hand).to.have.length(4);
		});
		it('gives 4 cards for the 3 other player',function(){
			expect(status.partner.hand).to.equal(4);
			expect(status.opponent_1.hand).to.equal(4);
			expect(status.opponent_2.hand).to.equal(4);
		});
		it('gives all the cards that has already been played by a player',function(){
			expect(status.playedCards.me.card.id).to.equal('S8');
			expect(status.playedCards.partner.card.id).to.equal('HA');
			expect(status.playedCards.opponent_1.card.id).to.equal('HJ');
			expect(status.playedCards.opponent_2.card.id).to.equal('S10');
		});
	});

	describe('getPlayer',function(){
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
		var player4 = new Player('dhamu');
		
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		it('gives the requested player',function(){
			var playerId = 'ranju';
			expect(game.getPlayer(playerId)).to.deep.equal(player3);
		});
	});

	describe('setRoundSequence',function(){
		var game = new Game();
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
		var game = new Game();
		var p1 = new Player('raju');
		var p2 = new Player('ramu');
		var p3 = new Player('raka');
		var p4 = new Player('rahul');
		game.team_1.players = [p1,p3];
		game.team_2.players = [p2,p4];
		game.setDistributionSequence();
		game.setRoundSequence();
		game.nextTurn();
		it('gives the trun permission true of the next player',function(){
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
	})
	describe('setBidWinner',function(){
		var game = new Game();
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
			expect(game.bid.value).to.not.equal(null);
		});

		it('sets the player who has bid the maximum',function(){
			expect(game.bid.player).to.not.equal(null);

		});
	});	

	describe('getFinalBidStatus',function(){
		var game = new Game();
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
		var bidStatus = game.getFinalBidStatus();
		it('gets the highest bid value which has already fibed',function(){
			expect(bidStatus).to.have.property('player').and.to.equal('123');
		});
		it('gets the bid value which has already fibed',function(){
			expect(bidStatus.value).to.equal(16);
		});
	});

	describe('isValidCardToThrow',function(){
		var game;
		beforeEach(function(){
			game = new Game();
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
	});

	describe('getRelationship',function(){
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
		var player4 = new Player('dhamu');
		
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];

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
			var game = new Game();
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
			var game = new Game();
			game.playedCards = [];
			var playerHand = [{ name: 'J', suit: 'Diamond', point: 3, rank: 1 },
							{ name: '7', suit: 'Heart', point: 0, rank: 8 },
							{ name: '9', suit: 'Club', point: 2, rank: 2 },
							{ name: '7', suit: 'Diamond', point: 0, rank: 8 }];

			var expectedResult = game.ableToAskForTrumpSuit(playerHand);
			expect(expectedResult).to.be.false;
		});

		it("allows a player to see the trump suit if the player doesn't have the running suit",function(){
			var game = new Game();
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
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
		var player4 = new Player('dhamu');
		game.team_1.players = [player1,player2];
		game.team_2.players = [player3,player4];
		game.setDistributionSequence();
		game.distributeCards(game);
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
		});
	});

	describe('addPlayer',function(){
		it('assigns a player to team_1 when there are no player in both the team',function(){
			var game = new Game();
			var player = 'Ramu';
			game.addPlayer(player);
			expect(game.team_1.players).to.have.length(1);
			expect(game.team_2.players).to.have.length(0);
			expect(game.team_1.players[0].id).to.equal('Ramu');
		});
		it('assigns a player in team_2 when team_1 has two players and team_2 has no player',function(){
			var game = new Game();
			game.team_1.players.push('ramu');
			game.team_1.players.push('raju');

			var player = 'Shibu';
			game.addPlayer(player);
			expect(game.team_1.players).to.have.length(2);
			expect(game.team_2.players).to.have.length(1);
			expect(game.team_2.players[0].id).to.equal('Shibu');
		});
	});
	describe('playerCount',function(){
		it('counts the number of player a game has',function(){
			var game = new Game();
			game.team_1 = {players : ['Ramu','Mamu']},
			game.team_2 = {players : ['Dada']}
		
			expect(game.playerCount(game)).to.equal(3);
		});
		it('gives zero when there is no player',function(){
			var game = new Game();
			game.team_1 = {players : []},
			game.team_2 = {players : []}
			expect(game.playerCount(game)).to.equal(0);
		});
	});
	describe('gameInitializer',function(){
		// it('sets the game after one game finish for next deal',function(){
	// 
		// });
	});

	describe('calculateTotalPoint',function(){
		var game = new Game(); 
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
			assert.equal(18,game.calculateTotalPoint(teamBucket));
		});

	});

	describe('roundWinner',function(){
		var game = new Game();
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
			assert.equal('10.4.20.153_rahul',game.roundWinner(playedCardsSet_1));
			assert.equal('10.4.20.143_brindaban',game.roundWinner(playedCardsSet_2));
			assert.equal('10.4.20.173_sayan',game.roundWinner(playedCardsSet_3));

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
			var playedCardsSet_6 = [{player:'10.4.20.173_sayan',
							card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
							trumpShown: true
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
			var playedCardsSet_7 = [{player:'10.4.20.173_sayan',
							card:{ name: 'K', suit: 'Club', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'10.4.20.163_sayani',
							card:{ name: 'Q', suit: 'Heart', point: 0, rank: 6 },
							trumpShown: true
							},
							{player:'10.4.20.143_brindaban',
							card:{ name: '8', suit: 'Spade', point: 0, rank: 7 },
							trumpShown: true
							},
							{player:'10.4.20.153_rahul',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							}];
			var playedCardsSet_8 = [{player:'10.4.20.173_sayan',
							card:{ name: 'K', suit: 'Club', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'10.4.20.163_sayani',
							card:{ name: 'Q', suit: 'Heart', point: 0, rank: 6 },
							trumpShown: true
							},
							{player:'10.4.20.143_brindaban',
							card:{ name: 'K', suit: 'Heart', point: 0, rank: 5 },
							trumpShown: true
							},
							{player:'10.4.20.153_rahul',
							card:{ name: 'K', suit: 'Diamond', point: 0, rank: 5 },
							trumpShown: true
							}];

			assert.equal('10.4.20.163_sayani',game.roundWinner(playedCardsSet_1,'Diamond'));
			assert.equal('10.4.20.143_brindaban',game.roundWinner(playedCardsSet_2,'Spade'));
			assert.equal('10.4.20.163_sayani',game.roundWinner(playedCardsSet_3,'Diamond'));
			assert.equal('10.4.20.143_brindaban',game.roundWinner(playedCardsSet_4,'Diamond'));
			assert.equal('10.4.20.153_rahul',game.roundWinner(playedCardsSet_5,'Club'));
			assert.equal('10.4.20.163_sayani',game.roundWinner(playedCardsSet_6,'Diamond'));
			assert.equal('10.4.20.163_sayani',game.roundWinner(playedCardsSet_7,'Heart'));
			assert.equal('10.4.20.143_brindaban',game.roundWinner(playedCardsSet_8,'Heart'));
		});
	});

	describe('updateScore',function(){
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
		var player4 = new Player('dhamu');
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
			game.bid = {value : 18, player : 'raju'};
			game.updateScore(game);
			expect(game.team_1.score).to.equal(1);
		});

		it('increases the score of the bidding team when they gain more than the bidding point',function() {
			game.bid = {value : 17, player : 'raju'};
			game.updateScore(game);
			expect(game.team_1.score).to.equal(2);
		});

		it('decreases the score of the bidding team when they gain less than the bidding point',function() {
			game.bid = {value : 19, player : 'raju'};
			game.updateScore(game);
			expect(game.team_1.score).to.equal(1);
		});
	});

	describe('manipulateBidValueForPair',function() {
		var game;
		beforeEach(function(){
			game = new Game();
			var player1 = new Player('ramu');
			var player2 = new Player('raju');
			var player3 = new Player('ranju');
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

		it('fixes the bid value to 16, when a player of bid winning team has royal pair and bid bid value will be less than 21', function() {
			game.bid.value = 19;
			game.trump = {suit: 'Heart', open: true};
			var bidWinningTeam = 'team_2';
			var opponentTeam = 'team_1';
			game.pairChecking(game);
			game.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
			expect(game.bid .value).to.be.equal(16);
		});
		it('decreases the bid value by 4, when a player of bid winning team has royal pair and bid bid value will be more than 20', function() {
			game.bid.value = 23;
			game.trump = {suit: 'Heart', open: true};
			var bidWinningTeam = 'team_2';
			var opponentTeam = 'team_1';
			game.pairChecking(game);
			game.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
			expect(game.bid .value).to.be.equal(19);
		});
		it('increases the bid value by 4, when a player of opponent team has royal pair and bid bid value will be less than 24', function() {
			game.bid.value = 19;
			game.trump = {suit: 'Heart', open: true};
			var bidWinningTeam = 'team_1';
			var opponentTeam = 'team_2';
			game.pairChecking(game);
			game.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
			expect(game.bid .value).to.be.equal(23);
		});
		it('fixes the bid value to 28, when a player of opponent team has royal pair and bid bid value will be more than 23', function() {
			game.bid.value = 26;
			game.trump = {suit: 'Heart', open: true};
			var bidWinningTeam = 'team_1';
			var opponentTeam = 'team_2';
			game.pairChecking(game);
			game.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
			expect(game.bid .value).to.be.equal(28);
		});
		it('does not change the bid value when, both team do not have royal pair', function() {
			game.bid.value = 20;
			game.trump = {suit: 'Club', open: true};
			var bidWinningTeam = 'team_1';
			var opponentTeam = 'team_2';
			game.pairChecking(game);
			game.manipulateBidValueForPair(game, bidWinningTeam, opponentTeam);
			expect(game.bid .value).to.be.equal(20);
		});
	});

	describe('pairChecking', function() {
		var game = new Game();
		var player1 = new Player('ramu');
		var player2 = new Player('raju');
		var player3 = new Player('ranju');
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
			game.pairChecking(game);
			expect(game.team_2.players[0].hasPair).to.be.true;
			expect(game.team_2.players[1].hasPair).to.be.false;
		});
		it('will not set hasPair true for the player not having trump suit pair, but having pair of another suit', function() {
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking(game);
			expect(game.team_2.players[1].hasPair).to.be.false;
		});
		it('will not set hasPair true for the player not having trump suit pair', function() {
			game.trump = {suit: 'Heart', open: true};
			game.pairChecking(game);
			expect(game.team_1.players[1].hasPair).to.be.false;
		});
	});

});