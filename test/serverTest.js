var request = require('supertest');

var controller = require('../server');
var game = require('../clientHandler').game;

describe('controller', function(){
	describe('GET: /',function(){
		it('serves the login page', function(done){
			request(controller)
				.get('/')
				.expect(/Join Game/)
				.expect(200, done);
		});
	});
	describe('POST: /waiting.html', function(){
		it('serves the waiting page when 1st player joins the game', function(done){
			request(controller)
				.post('/waiting.html')
				.set('Cookie', 'id=Rahul')
				.send('name=Rahul')
				.expect(302,done);
		});
		it('serves the waiting page when 2nd player joins the game', function(done){
			request(controller)
				.post('/waiting.html')
				.set('Cookie', 'id=nandi')
				.send('name=nandi')
				.expect(302, done);
		});
		it('serves the waiting page when 3rd player joins the game', function(done){
			request(controller)
				.post('/waiting.html')
				.set('Cookie', 'id=Prasun')
				.send('name=Prasun')
				.expect(302,done);
		});		
		it('serves the waiting page when 4th player joins the game', function(done){
			request(controller)
				.post('/waiting.html')
				.set('Cookie', 'id=PK')
				.send('name=PK')
				.expect(302, done);
		});
		it('will complain for the request with status code 403 when already 4 players are playing', function(done){
			request(controller)
				.post('/waiting.html')
				.send('id=P_K')
				.expect(403)
				.expect(/4 players are already playing/)
				.end(done);
		});

	});
	describe('POST: /setTrump',function(){
		it('sets the trump suit',function(done){
			request(controller)
				.post('/setTrump')
				.send('D2')
				.expect(202)
				.end(done);
		});
	});
	describe('GET: /waiting', function(){
		it('gives the count of player needed to start the game', function(done){
			request(controller)
				.get('/waiting')
				.expect('0')
				.expect(200, done);
		});
	});
	describe('POST: /throwCard', function(){
		it('removes a card from the player\'s hand',function(done){
			request(controller)
				.post('/throwCard')
				.send('DA')
				.set('Cookie', 'Rahul')
				.expect(200, done);
		});
		it('removes a card when throwing conditions are satisfied',function(done){
			game.team_2.players[1].turn = true;
			game.team_2.players[1].hand = [{ id: 'C7', suit: 'Club', name: '7', point: 0, rank: 8 }];
			game.playedCards = [];
			request(controller)
				.post('/throwCard')
				.set('Cookie', 'PK')
				.send('C7')
				.expect(200,done);

		});

	});
	describe('GET: /<static files>', function(){
		it('gives the static files that is requested', function(done){
			request(controller)
				.get('/gamepage.html')
				.expect(200,done);
		});
	});

	describe('GET: /<file that is not present>', function(){
		it('gives 404 statusCode', function(done){
			request(controller)
				.get('/status.js')
				.expect(404,done);
		});
	});

	describe('POST: /<invalid method>', function(){
		it('will complain for the request with status code 405',function(done){
			request(controller)
				.post('/invalidMethod')
				.expect(405, done);
		});
	});	

	describe('GET: /getTrump',function(){
		it('does not give the trump that has been set when he does not satisfy the condition',function(done){
			game.playedCards=[];
			request(controller)
				.get('/getTrump')
				.set('Cookie', 'Rahul')
				.expect(406)
				.expect(/Not/)
				.end(done);	
		});
		it('gives the trump when he satisfy the condition', function(done){
			// setup
			game.team_1.players[0].hand = [{ id: 'C7', suit: 'Club', name: '7', point: 0, rank: 8 }];
			game.playedCards = [{
				player: "PK",
				card: { id: 'H7', suit: 'Heart', name: '7', point: 0, rank: 8 },
				trumpShown : false
			}];
			//test
			request(controller)
				.get('/getTrump')
				.set('Cookie', 'Rahul')
				.expect(200)
				.expect(/D2/)
				.end(done);	
		});
	});
});