"use strict";

const _ = require("lodash");
module.exports =  class Game{

    constructor(channel){
        this.channel = channel;
        this.allCards = require("./cahcards.json");
        this.players = new Map();
        this.turn = 0;
    }

    async addPlayer(id, name){
        this.players.set(id, new Player(id, name));
        for(let i = 0 ; i< 10; i++){

        }
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