"use strict";
const Game = require("./game");

class GameManager{

    constructor(){
        this.games = new Map();
    }
    

    async createGame(channel){
        let channelId = channel.id;
        if(this.games.get(channelId)){
            throw "There is already a game on this channel! Please use the command cah_stop";
        }
        let game = new Game(channel);
        this.games.set(channelId, game);
        return game;

    }

    async destroyGame(channelId){
        if(!this.games.get(channelId)){
            throw "There is no game to stop";
        }
        this.games.delete(channelId);
    }

}

module.exports = new GameManager();