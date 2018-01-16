"use strict";

module.exports = class PingCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }
    async run() {
        this.message.channel.send("pong!");
    }
}


    