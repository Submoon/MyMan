"use strict";
const logger = require("../utils/logger");

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
        let startTime = +new Date();
        let message = await this.message.channel.send("Pong!");
        let endTime = +new Date();
        let diff = endTime-startTime;
        message.edit(`Pong (${diff}ms)`)
        logger.info(`Received ping command, ping = ${diff}ms`)
    }
}


    