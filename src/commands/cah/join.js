"use strict";
const gamemanager = require("./model/gamemanager");

module.exports =  class CahJoinCommand{
    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Allows to join a cah game",
            usage: "cah_join"
        };
    }

    async run() {

        let channelId = this.message.channel.id;
        let user = this.message.author;
        gamemanager.joinGame(channelId, user)
        .then(player => {
            this.message.channel.send(`Player ${player.user} joined the game`);
            let embed = player.printCards();
            user.send({embed});
        })
        .catch(ex => {
            console.error(ex);
            this.message.channel.send("Error: "+ ex);
        })
    }
}