"use strict";

module.exports = class PingCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Pings the server",
            usage: "ping"
        };
    }

    async run() {
        this.message.channel.send("pong!");
    }
}


    