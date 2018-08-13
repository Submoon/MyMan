"use strict";

const gamemanager = require("./model/gamemanager")

module.exports =  class CahLeaveCommand{
    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Allows to leave a cah game",
            usage: "cah_leave"
        };
    }

    async run() {
        let channelId = this.message.channel.id;
        let user = this.message.author;
        gamemanager.playerLeave(channelId, user.id).then(() => {
            this.message.channel.send(`Player ${user} left the game`);
        }).catch(error => {
            this.message.channel.send("Error: "+error);
        });
    }
}