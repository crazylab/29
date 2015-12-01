var m = require('../croupier.js').croupier;
var team = require('../teamFormation.js').team;
var d = require('../cardGenerator.js').m;

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

describe('getShuffledDeck',function(){
	var shuffledDeck = m.getShuffledDeck();
	describe('shuffle',function(){
		it('will get 32 cards after shuffling',function(){
			expect(shuffledDeck).to.have.length(32);
		});
	});
});

describe('setIdAndNames',function(){
	var playerNames = ['10.2.45.178','10.2.45.173','10.2.45.192','10.4.45.191'];
	var playersWithID = m.makeTeams(playerNames);
	it('sets id for each player and asserts name to each',function(){
		expect(playersWithID).to.have.all.keys('team_1','team_2');
	});
});

describe('dealCardsToAPlayer',function(){
	var fourCards = [ { name: '10', suit: 'Heart', point: 1, rank: 4 },
  						{ name: '9', suit: 'Spade', point: 2, rank: 2 },
						{ name: '8', suit: 'Diamond', point: 0, rank: 7 },
 						{ name: '7', suit: 'Heart', point: 0, rank: 8 } ];
 	var playerWithDetail = {name: 'ramu', id: '3', hand : {Heart:[],Spade:[],Club:[],Diamond:[]}, hasPair : false};
	it('distributes four cards to a player',function(){
		var player = m.dealCardsToAPlayer(fourCards,playerWithDetail);
		expect(player.hand.Heart).to.have.length(2);
		expect(player.hand.Club).to.have.length(0);
		expect(player.hand.Diamond).to.have.length(1);
		expect(player.hand.Spade).to.have.length(1);
	});
});
