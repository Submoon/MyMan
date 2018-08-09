"use strict";
const logger = require("../utils/logger");

module.exports = class PingCommand{

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
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
        let createdAt = this.message.createdTimestamp;
        let message = await this.message.channel.send("Pong!");
        let endTime = message.createdTimestamp;
        let diff = endTime-createdAt;
        message.edit(`Pong (${diff}ms)`)
        logger.info(`Received ping command, ping = ${diff}ms`)
    }
}


    