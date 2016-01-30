var gameStore = require('../lib/gameStore.js');

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var sinon = require('sinon');

var initializeGameStore = function(){
    delete gameStore.game_1;
    delete gameStore.game_2;
    delete gameStore.game_3;
    gameStore.latestGame = null;
}
describe('gameStore', function(){
    var game_1 = {
        id : 'game_1',
        getID : sinon.stub().returns('game_1')
    };
    var game_2 = {
        id : 'game_2',
        getID : sinon.stub().returns('game_2')
    };
    var game_3 = {
        id : 'game_3',
        getID : sinon.stub().returns('game_3')
    };

    describe('addGame', function(){
        it('adds a game in the gameBucket', function(){
            initializeGameStore();

            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.game_1).to.deep.equal(game_1);
            expect(gameStore.game_2).to.deep.equal(game_2);
            expect(gameStore.game_3).to.deep.equal(game_3);
        });
    });

    describe('latestGame', function(){
        beforeEach(initializeGameStore);

        it('gives the null when no game has been created', function(){
            expect(gameStore.getLatestGame()).to.deep.equal(null);
        });
        it('gives the latest game that has been created', function(){
            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.getLatestGame()).not.to.deep.equal(game_1);
            expect(gameStore.getLatestGame()).not.to.deep.equal(game_2);
            expect(gameStore.getLatestGame()).to.deep.equal(game_3);
        });
    });

    describe('getGame', function(){
        beforeEach(initializeGameStore);

        it('gives the game with the given ID', function(){
            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.getGame('game_2')).to.deep.equal(game_2);
            expect(gameStore.getGame('game_1')).to.deep.equal(game_1);
        });
        it('gives null when no game is found with the given game ID', function(){
            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.getGame('game_20')).to.deep.equal(null);
        });
    });

    describe('deleteGame', function(){
        beforeEach(initializeGameStore);

        it('deletes a game from the game bucket and returns true if successfully deleted', function(){
            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.deleteGame('game_2')).to.deep.equal(true);
            expect(gameStore.deleteGame('game_1')).to.deep.equal(true);

            expect(gameStore.getGame('game_2')).to.deep.equal(null);
            expect(gameStore.getGame('game_1')).to.deep.equal(null);
        });
        it('does not deletes a game from the game bucket and returns false if the game with given game ID does not exist', function(){
            gameStore.addGame(game_1);
            gameStore.addGame(game_2);
            gameStore.addGame(game_3);

            expect(gameStore.deleteGame('game_200')).to.deep.equal(false);

            expect(gameStore.getLatestGame()).not.to.deep.equal(game_1);
            expect(gameStore.getLatestGame()).not.to.deep.equal(game_2);
            expect(gameStore.getLatestGame()).to.deep.equal(game_3);
        });
    });
});
