"use strict";

const gamemanager = require("./model/gamemanager")

module.exports =  class CahStartCommand{
    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Allows to start a cah game",
            usage: "cah_start"
        };
    }

    async run() {
        gamemanager.createGame(this.message.channel).then(game => {
            this.message.channel.send(`Game started for channel ${game.channel}\nPlease join the game by using cah_join`);
        }).catch(error => {
            this.message.channel.send("Error: "+error);
        });
    }
}