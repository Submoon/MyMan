"use strict";

const _ = require("lodash");
const Player = require("./player");
module.exports =  class Game{

    constructor(channel){
        this.channel = channel;
        this.allCards = require("./cahcards.json");
        /**@property {Map<string, Player>} players*/
        this.players = new Map();
        this.turn = 0;
        this.deckWhiteCards = _.shuffle(this.allCards.whiteCards);
        this.deckBlackCards = _.shuffle(this.allCards.blackCards);
        this.playedWhiteCards = [];
        this.playedBlackCards = [];
    }

    async addPlayer(user){
        if(this.players.get(user.id)){
            throw "You're already in the game !";
        }
        let player = new Player(user);

        for(let i=0; i<10; i++){
            let card = this.deckWhiteCards.shift();
            player.drawCard(card)
        }

        this.players.set(player.user.id, player);
        return player;
    }

    async playerLeave(playerId){
        if(!this.players.delete(playerId)){
            throw "You are are not part of the game !";
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