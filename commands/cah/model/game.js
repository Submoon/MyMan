"use strict";

const _ = require("lodash");
const Player = require("./player");
module.exports =  class Game{

    constructor(channel){
        this.channel = channel;
        this.allCards = require("./cahcards.json");
        this.players = new Map();
        this.turn = 0;
    }

    async addPlayer(user){
        if(this.players.get(user.id)){
            throw "You're already in the game !";
        }
        let player = new Player(user);
        this.players.set(player.user.id, player);
        return player;
    }


    async startGame(){

    }


    async playTurn(){
        setTimeout()
    }

    async playerPicked(playerId, cardId){
        this.players.get(playerId).picked = cardId;
    }

}