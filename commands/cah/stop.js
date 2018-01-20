"use strict";

const gamemanager = require("./model/gamemanager")

module.exports =  class CahJoinCommand{
    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Allows to stop a cah game",
            usage: "cah_stop"
        };
    }

    async run() {
        gamemanager.destroyGame(this.message.channel.id).then(() => {
            this.message.channel.send(`Game stopped for channel ${this.message.channel}`);
        }).catch(error => {
            this.message.channel.send("Error: "+error);
        });
    }
}