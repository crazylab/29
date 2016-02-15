var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var gameController = require('../lib/gameController');
var gameStore = require('../lib/gameStore');

describe('controller', function(){
	describe('GET: /',function(){
		it('serves the login page', function(done){
			var controller = gameController();

			request(controller)
				.get('/')
				.expect(/Join Game/)
				.expect(200, done);
		});
	});
	describe('POST: /add_player', function(){
		it('serves the waiting page when 1st player joins the game', function(done){
			var game = {
				getId : sinon.stub().returns(32),
				playerCount : sinon.stub().returns(0),
				addPlayer : sinon.stub().returns(true)
			};
			gameStore['32'] = game;
			var controller = gameController();
			request(controller)
				.post('/add_player')
				.send('name=Rahul')
				.expect(302)
				.expect('Location',/waiting.html/)
				.end(done);

		});
	});
	describe('POST: /setTrump',function(){
		it('sets the trump suit',function(done){
			var game = {
				getId : sinon.stub().returns(32),
				trump : {suit: undefined},
				setTrumpSuit : sinon.spy(),
				setRoundSequence : sinon.spy(),
				getPlayer : sinon.stub().returns(true),
				isNotActive : sinon.stub().returns(false)
			};
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.post('/setTrump')
				.set('Cookie','gameID=32')
				.send('trump=D2')
				.expect(202)
				.end(done);
		});
	});
	describe('GET: /playerCount', function(){
		it('gives the count of player needed to start the game', function(done){
			var game = {
				getId : sinon.stub().returns(32),
				playerCount : sinon.stub().returns(2),
				getPlayer : sinon.stub().returns(true),
				isNotActive : sinon.stub().returns(false)
			};
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.get('/playerCount')
				.set('Cookie','gameID=32')
				.expect('2')
				.expect(200, done);
		});
	});
	describe('POST: /throwCard', function(){
		var player = {
			turn : true,
			removeCard : function(){}
		}
		var game = {
			getId : sinon.stub().returns(32),
			trump : sinon.stub().returns(true),
			playerCount : sinon.stub().returns(0),
			addPlayer : sinon.spy(),
			setTrumpSuit : sinon.spy(),
			getPlayer : sinon.stub().returns(player),
			nextTurn : function(){},
			playedCards : [],
			playCard : sinon.stub().returns(true),
			isNotActive : sinon.stub().returns(false)
		};
		it('removes a card from the player\'s hand',function(done){
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.post('/throwCard')
				.send('name=X')
				.set('Cookie','gameID=32')
				.expect(200, done);
		});
		it('removes a card when throwing conditions are satisfied',function(done){
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.post('/throwCard')
				.send('name=X')
				.set('Cookie','gameID=32')
				.send('C7')
				.expect(200,done);
		});
		it('does not removes a card when throwing conditions are satisfied',function(done){
			game.playCard = sinon.stub().returns(false)
			gameStore['32'] = game;

			var controller = gameController();

			request(controller)
				.post('/throwCard')
				.send('name=X')
				.set('Cookie','gameID=32')
				.send('C7')
				.expect(406,done);
		});
	});
	describe('GET: /<static files>', function(){
		it('gives the static files that is requested', function(done){
			var controller = gameController();

			request(controller)
				.get('/help.html')
				.expect(200,done);
		});
	});

	describe('GET: /<file that is not present>', function(){
		it('redirects to login page', function(done){
			var controller = gameController();

			request(controller)
				.get('/status.js')
				.expect('Location',/index.html/)
				.expect(302,done);
		});
	});

	describe('POST: /<invalid method>', function(){
		it('will redirects to the login page when not authenticated',function(done){
			var controller = gameController();

			request(controller)
				.post('/invalidMethod')
				.expect('Location',/index.html/)
				.expect(302, done);
		});
	});

	describe('GET: /getTrump',function(){
		it('does not give the trump that has been set when he does not satisfy the condition',function(done){
			var player = {
				hand: [{ id: 'C7', suit: 'Club', name: '7', point: 0, rank: 8 }],
				turn:true
			};
			var game = {
				getId : sinon.stub().returns(32),
				getPlayer : sinon.stub().returns(player),
				playedCards : [{
					player: "PK",
					card: { id: 'H7', suit: 'Heart', name: '7', point: 0, rank: 8 },
					trumpShown : false
				}],
				getTrumpSuit : sinon.stub().returns('D2'),
				ableToAskForTrumpSuit : sinon.stub().returns(false),
				isNotActive : sinon.stub().returns(false)
			};
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.get('/getTrump')
				.set('Cookie','gameID=32')
				.send('id=Y')
				.expect(406)
				.expect(/Not/)
				.end(done);
		});
		it('gives the trump when he satisfy the condition', function(done){
			var player = {
				hand: [{ id: 'C7', suit: 'Club', name: '7', point: 0, rank: 8 }],
				turn:true
			};
			var game = {
				getId : sinon.stub().returns(32),
				getPlayer : sinon.stub().returns(player),
				playedCards : [{
					player: "PK",
					card: { id: 'H7', suit: 'Heart', name: '7', point: 0, rank: 8 },
					trumpShown : false
				}],
				getTrumpSuit : sinon.stub().returns('D2'),
				ableToAskForTrumpSuit : sinon.stub().returns(true),
				isNotActive : sinon.stub().returns(false)
			};
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.get('/getTrump')
				.set('Cookie','gameID=32')
				.send('id=Y')
				.expect(200)
				.expect(/D2/)
				.end(done);
		});
	});
	describe("POST: /leave_game.html",function() {
		it("resets the game to initial condition",function(done){
			var game = {
				getId : sinon.stub().returns(32),
				end : false,
				getPlayer : sinon.stub().returns(true),
				isNotActive : sinon.stub().returns(false)
			}
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.post('/leave_game.html')
				.expect(302)
				.set('Cookie','gameID=32')
				.expect('Location',/leave_game.html/)
				.end(done);
		});
	});
	describe("POST: /bid", function(){
		it("sets the bid value for a player", function(done){
			var game = {
				getId : sinon.stub().returns(32),
				setBid : sinon.spy(),
				getCurrentBidder : sinon.stub().returns('Y'),
				getPlayer : sinon.stub().returns(true),
				isNotActive : sinon.stub().returns(false)
			};
			gameStore['32'] = game;
			var controller = gameController();

			request(controller)
				.post('/bid')
				.set('Cookie','gameID=32; id=Y')
				.send('bid=20')
				.expect(202)
				.end(done);
		});
	});
	it('does not let the user go to any other page than index page without authentication', function(done){
		var controller = gameController();
		request(controller)
			.get('/gamePage.html')
			.expect(302)
			.expect('Location',/index.html/)
			.end(done);
    });
});
