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
				isBidder : false,
				_7thCard: false,
				point : 0
			};
			expect(status).to.deep.equal(expectedStatus);
		});
		it('gives the player\'s status with number of cards in hand when the player is third party',function(){
			var status = player.getStatus(true);
			var expectedStatus = {
				hand : 4,
				turn : false,
				isBidder : false,
				_7thCard: false,
				point : 0
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
	describe('throwCard',function(){
		it('removes the card from player\'s hand and returns the card',function(){
			player.hand = [{id:'SJ', name:'J', suit:'Spade'},
				{id:'S7', name:'7', suit:'Spade'},
				{id:'C9', name:'9', suit:'Club'},
				{id:'SK', name:'K', suit:'Spade'}];
			var deletedCard = player.throwCard('SJ');
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

	describe('arrangeCards', function(){
		it('arrange cards according to priority in a particular suit', function(){
			var player = new Player();
			player.hand = [
				{rank: 3, suit:'Spade'},
				{rank: 1, suit:'Spade'},
				{rank: 6, suit:'Club'},
				{rank: 2, suit:'Spade'},
				{rank: 2, suit:'Club'},
				{rank: 5, suit:'Heart'},
				{rank: 3, suit:'Diamond'}
			];
			var expectedHand = [
				{rank: 1, suit:'Spade'},
				{rank: 2, suit:'Spade'},
				{rank: 3, suit:'Spade'},
				{rank: 5, suit:'Heart'},
				{rank: 2, suit:'Club'},
				{rank: 6, suit:'Club'},
				{rank: 3, suit:'Diamond'}
			];
			player.arrangeCards();
			expect(player.hand).to.deep.equal(expectedHand);
	    });
	});
	describe('get7thCard', function(){
	    it('gives the 7th card from the hand by removing that card from the hand and keeps in _7thCard', function(){
	        var player = new Player();
			player.hand = [
				{name: 'A', suit:'Spade'},
				{name: 'J', suit:'Spade'},
				{name: 'K', suit:'Club'},
				{name: 'Q', suit:'Spade'},
				{name: '9', suit:'Club'},
				{name: '10', suit:'Heart'},
				{name: '7', suit:'Diamond'},
				{name: '6', suit:'Diamond'}
			];
			expect(player.get7thCard()).to.deep.equal({name: '7', suit:'Diamond'});
			expect(player['_7thCard']).to.deep.equal({name: '7', suit:'Diamond'});
	    });
	});

	describe('hasCard', function(){
		var player = new Player();
		player.hand = [
			{id: 'SA', name: 'A', suit:'Spade'},
			{id: 'SJ', name: 'J', suit:'Spade'},
			{id: 'CK', name: 'K', suit:'Club'},
			{id: 'SQ', name: 'Q', suit:'Spade'},
			{id: 'C9', name: '9', suit:'Club'},
			{id: 'H10', name: '10', suit:'Heart'},
			{id: 'D7', name: '7', suit:'Diamond'},
			{id: 'D6', name: '6', suit:'Diamond'}
		];

		it('gives true if the player has the card in his hand', function(){
			expect(player.hasCard('CK')).to.be.true;
		});

		it('gives false if the player does not have the card in his hand', function(){
			expect(player.hasCard('DA')).to.be.false;
		});
	});

	describe('hasSameSuitCard', function(){
		var player = new Player();
		player.hand = [
			{id: 'SA', name: 'A', suit:'Spade'},
			{id: 'SJ', name: 'J', suit:'Spade'},
			{id: 'CK', name: 'K', suit:'Club'},
			{id: 'SQ', name: 'Q', suit:'Spade'},
			{id: 'C9', name: '9', suit:'Club'},
			{id: 'C10', name: '10', suit:'Club'},
			{id: 'D7', name: '7', suit:'Diamond'},
			{id: 'D6', name: '6', suit:'Diamond'}
		];

		it('gives true if the player has the card of same suit with the given card', function(){
			expect(player.hasSameSuitCard('C7')).to.be.true;
		});

		it('gives false if the player does not have card with matching suit', function(){
			expect(player.hasSameSuitCard('HA')).to.be.false;
		});
	});

	describe('getThrowableCard', function(){
	    it('gives a card that can be played when the current player has first turn', function(){
	        var player = new Player();
			player.hand = [
				{name: 'A', suit:'Spade'},
				{name: 'J', suit:'Spade'},
				{name: 'K', suit:'Club'},
				{name: 'Q', suit:'Spade'},
				{name: '9', suit:'Club'},
				{name: '10', suit:'Heart'},
				{name: '7', suit:'Diamond'},
				{name: '6', suit:'Diamond'}
			];

			expect(player.getThrowableCard()).to.deep.equal({name: 'A', suit:'Spade'});
	    });
	});
});
