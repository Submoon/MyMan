"use strict";

module.exports = class PingCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Give the user his current level and xp",
            usage: "level_get"
        };
    }

    async run() {
        this.message.channel.send("Not yet implemented");
    }
}