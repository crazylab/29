var Player = require('../lib/player');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Player',function(){
	var player = new Player('Raju');
	player.hand = [{id:'S4', name:'4', suit:'Spade'},
		{id:'SQ', name:'Q', suit:'Spade'},
		{id:'C9', name:'9', suit:'Club'},
		{id:'SK', name:'K', suit:'Spade'}];
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
				hand : [{id:'S4', name:'4', suit:'Spade'},
					{id:'SQ', name:'Q', suit:'Spade'},
					{id:'C9', name:'9', suit:'Club'},
					{id:'SK', name:'K', suit:'Spade'}],
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

	describe('checkPair',function(){
		it('sets player\'s hasPair property true when the player has the pair of trump suit',function(){
			var trumpSuit = 'Spade';
			player.checkPair(trumpSuit);
			expect(player.hasPair).to.be.true;
		});
		it('keeps player\'s hasPair property unchanged when the player has the pair but not of trumpSuit', function(){ 
			var trumpSuit = 'Diamond';
			player.hasPair = false;
			player.checkPair(trumpSuit);
			expect(player.hasPair).to.be.false;
		});
		it('keeps player\'s hasPair property unchanged when the player doesn\'t have the pair', function(){ 
			var trumpSuit = 'Diamond';
			player.hand = [{id:'SJ', name:'J', suit:'Spade'},
				{id:'S7', name:'7', suit:'Spade'},
				{id:'C9', name:'9', suit:'Club'},
				{id:'SK', name:'K', suit:'Spade'}]
			player.hasPair = false;
			player.checkPair(trumpSuit);
			expect(player.hasPair).to.be.false;
		});
	});
	describe('removeCard',function(){
		it('removes the card from player\'s hand and returns the card',function(){
			player.hand = [{id:'SJ', name:'J', suit:'Spade'},
				{id:'S7', name:'7', suit:'Spade'},
				{id:'C9', name:'9', suit:'Club'},
				{id:'SK', name:'K', suit:'Spade'}];
			var deletedCard = player.removeCard('SJ');
			expect(player.hand.length).to.be.equal(3);
			assert.deepEqual(deletedCard,{id:'SJ', name:'J', suit:'Spade'});
		});
	});

	describe('getCardID',function(){
		it('gives all the card IDs those are in player\'s hand',function(){
			var player = new Player();
			player.hand = [{id:'SJ', name:'J', suit:'Spade'},
				{id:'S7', name:'7', suit:'Spade'},
				{id:'C9', name:'9', suit:'Club'},
				{id:'SK', name:'K', suit:'Spade'}];
			
			var expectedResult = ['SJ', 'S7', 'C9', 'SK'];
			var actualResult = player.getCardID();
			assert.deepEqual(expectedResult,actualResult);
		});
	});

	describe('getCardsCount',function(){
		it('gives the number of cards those are in player\'s hand',function(){
			var player = new Player('shyam');
			player.hand = [{id:'SJ', name:'J', suit:'Spade'},
				{id:'S7', name:'7', suit:'Spade'},
				{id:'C9', name:'9', suit:'Club'}];
			
			var expectedResult = 3;
			var actualResult = player.getCardsCount();
			assert.deepEqual(expectedResult,actualResult);
		});
	});

	describe('getMyCard',function(){
		it('gives the card which player has already played',function(){
			var player = new Player('peter');
			var playedCards = [{player:'peter',
				card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
				trumpShown: false
				},
				{player:'john',
				card:{ name: '8', suit: 'Club', point: 0, rank: 7 },
				trumpShown: false
				},
				{player:'shiba',
				card:{ name: '9', suit: 'Club', point: 2, rank: 2 },
				trumpShown: false
				},
				{player:'rohan',
				card:{ name: 'J', suit: 'Club', point: 3, rank: 1 },
				trumpShown: false
			}];		
			var expectedCard = {player:'peter',
				card:{ name: '7', suit: 'Club', point: 0, rank: 8 },
				trumpShown: false
			};
			var actualCard = player.getMyCard(playedCards);
			assert.deepEqual(expectedCard,actualCard);
		});
	});
});