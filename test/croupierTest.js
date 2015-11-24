var m = require('../croupier.js').croupier;
var team = require('../teamFormation.js').team;

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

describe('shuffle',function(){
	it('gives the deck with shuffle property',function(){
		expect(m.getShuffledCards()).to.have.all.keys('cards');
	});
	it('will get 32 cards after shuffling',function(){
		expect(m.getShuffledCards().cards).to.have.length(32);
	});
})
