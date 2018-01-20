"use strict";
module.exports =  class Player{
    constructor(user){
        this.user = user;
        this.cards = [];
    }

    receiveCard(card){
        this.cards.push(card);
    }


}