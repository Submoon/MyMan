"use strict";
const Game = require("./game");

/**
 * Class GameManager
 */
class GameManager{

    constructor(){
        this.games = new Map();
    }
    

    /**
     * Create a game in this channel
     * @param {Channel} channel 
     * @return {Game} the created game
     */
    async createGame(channel){
        let channelId = channel.id;
        if(this.games.get(channelId)){
            throw "There is already a game on this channel! Please use the command cah_stop";
        }
        let game = new Game(channel);
        this.games.set(channelId, game);
        return game;

    }

    /**
     * Destroys/finishes a current game
     * @param {string} channelId The channel id
     * @throws Will throw an error if there is no game to stop
     */
    async destroyGame(channelId){
        if(!this.games.delete(channelId)){
            throw "There is no game to stop";
        }
    }

    /**
     * Makes the specified user join a cah game taking place in the specified channel
     * @param {string} channelId The channel Id
     * @param {user} user The user
     * @throws Will throw if there is no game to join in the specified channel
     * @return {Player} the created player object
     */
    async joinGame(channelId, user){
        let game = this.games.get(channelId);
        if(!game){
            throw "There is no game to join";
        }
        let player = await game.addPlayer(user);
        return player;
    }

    /**
     * Makes the player with the specified userId leave the cah game taking place in the channel with the specified channelId
     * @param {string} channelId The channel ID
     * @param {string} userId The user ID
     * @throws Will throw if there is no game to leave in the specified channel
     */
    async playerLeave(channelId, userId){
        let game = this.games.get(channelId);
        if(!game){
            throw "There is no game to leave in this channel";
        }
        await game.playerLeave(userId)
    }

}

module.exports = new GameManager();