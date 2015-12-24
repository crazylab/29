var request = require('supertest');
var http =  require('http');

var controller = require('../server');

describe('controller', function(){

	describe('GET: /',function(){
		it('serves the login page', function(done){
			request()
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
				.send('name=P_K')
				.expect(403)
				.expect(/4 players are already playing/)
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
				.set('Cookie', 'id=Rahul')
				.expect(200, done);
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
	describe('POST: /setTrump',function(){
		it('sets the trump suit',function(done){
			request(controller)
				.post('/setTrump')
				.send('D2')
				.expect(202)
				.end(done);
		});
	});
});