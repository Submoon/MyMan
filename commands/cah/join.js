"use strict";

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
        this.message.channel.send("Not implemented yet!");
    }
}