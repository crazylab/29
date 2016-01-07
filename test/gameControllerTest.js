var request = require('supertest');
var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var gameController = require('../lib/gameController');

describe('controller', function(){
	var game = {};
	beforeEach(function(){
		game = {
			team_1 : {
				players : [],
				addPlayer : function(){}
			},
			team_2 : {
				players : [],
				addPlayer : function(){}
			}
		};
	});
	describe('GET: /',function(){
		it('serves the login page', function(done){
			var game = {};
			var controller = gameController(game);
			
			request(controller)
				.get('/')
				.expect(/Join Game/)
				.expect(200, done);
		});
	});
	describe('POST: /waiting.html', function(){

		it('serves the waiting page when 1st player joins the game', function(done){
			game.addPlayer=sinon.stub().returns(true);
			var controller = gameController(game);
			request(controller)
				.post('/waiting.html')
				.send('name=Rahul')
				.expect(302)
				.end(done);

		});
		it('will complain for the request with status code 403 when already 4 players are playing', function(done){
			game.team_1.players = [{},{}];
			game.team_2.players = [{},{}];
			game.addPlayer=sinon.stub().returns(false);

			var controller = gameController(game);
			
			request(controller)
				.post('/waiting.html')
				.send('name=P_K')
				.expect(403)
				.expect('4 players are already playing')
				.end(done);
		});

	});
	describe('POST: /setTrump',function(){
		it('sets the trump suit',function(done){
			var game = {
				trump : {suit:undefined},
				distributionSequence : [],
				setTrumpSuit : sinon.spy(),
				setRoundSequence : sinon.spy()
			};
			var controller = gameController(game);

			request(controller)
				.post('/setTrump')
				.send('trump=D2')
				.expect(202)
				.end(done);
		});
	});
	describe('GET: /waiting', function(){
		it('gives the count of player needed to start the game', function(done){
			var game = {
				team_1: { players : [{},{}] },
				team_2: { players : [{}] },
				playerCount: sinon.stub().returns(2)
			};
			var controller = gameController(game);

			request(controller)
				.get('/waiting')
				.expect('2')
				.expect(200, done);
		});
	});
	describe('POST: /throwCard', function(){
		it('removes a card from the player\'s hand',function(done){
			var player = {
				turn : true,
				removeCard : function(){}
			}
			game = {
				getPlayer : sinon.stub().returns(player),
				isValidCardToThrow : sinon.stub().returns(true),
				playedCards : [],
				trump : sinon.stub().returns(true),
				nextTurn : function(){}
			};

			var controller = gameController(game);

			request(controller)
				.post('/throwCard')
				.set('Cookie', 'Rahul')
				.send('trump=DA')
				.expect(200, done);
		});
		it('removes a card when throwing conditions are satisfied',function(done){
			game = {
				getPlayer : sinon.stub().returns({}),
				isValidCardToThrow : sinon.stub().returns(true),
				playedCards : [],
				trump : sinon.stub().returns(true),
				nextTurn : function(){}
			};
			var controller = gameController(game);

			request(controller)
				.post('/throwCard')
				.set('Cookie', 'PK')
				.send('C7')
				.expect(200,done);

		});

	});
	describe('GET: /<static files>', function(){
		it('gives the static files that is requested', function(done){
			var controller = gameController(game);
		
			request(controller)
				.get('/gamepage.html')
				.expect(200,done);
		});
	});

	describe('GET: /<file that is not present>', function(){
		it('gives 404 statusCode', function(done){
			var controller = gameController(game);
		
			request(controller)
				.get('/status.js')
				.expect(404,done);
		});
	});

	describe('POST: /<invalid method>', function(){
		it('will complain for the request with status code 405',function(done){
			var controller = gameController(game);
			
			request(controller)
				.post('/invalidMethod')
				.expect(404, done);
		});
	});	

	describe('GET: /getTrump',function(){
		it('does not give the trump that has been set when he does not satisfy the condition',function(done){
			game = {
				getPlayer : sinon.stub().returns({}),
				ableToAskForTrumpSuit : sinon.stub().returns(false)
			};
			var controller = gameController(game);
			
			game.playedCards=[];
			request(controller)
				.get('/getTrump')
				.set('Cookie', 'Rahul')
				.expect(406)
				.expect(/Not/)
				.end(done);	
		});
		it('gives the trump when he satisfy the condition', function(done){
			var player = {
				id: 'Rahul',
				hand: [{ id: 'C7', suit: 'Club', name: '7', point: 0, rank: 8 }],
				checkPair : sinon.stub().returns(false),
				turn:true
			};
			game = {
				team_1 : {
					players: [player, player]
				},
				team_2 : {
					players: [player, player]
				},
				getPlayer : sinon.stub().returns(player),
				isValidCardToThrow : sinon.stub().returns(true),
				playedCards : [{
					player: "PK",
					card: { id: 'H7', suit: 'Heart', name: '7', point: 0, rank: 8 },
					trumpShown : false
				}],
				trump : sinon.stub().returns(true),
				getTrumpSuit : sinon.stub().returns('D2'),
				ableToAskForTrumpSuit : sinon.stub().returns(true)

			};
			var controller = gameController(game);
			
			request(controller)
				.get('/getTrump')
				.set('Cookie', 'Rahul')
				.expect(200)
				.expect(/D2/)
				.end(done);	
		});
	});
	describe("POST: /leaveGame",function() {
		it("resets the game to initial condition",function(done){
			var game = {};
			var controller = gameController(game);
			
			request(controller)
				.post('/leaveGame')
				.expect(302)
				.expect('Location',/leave_game.html/)
				.end(done);
		});
	}); 
});