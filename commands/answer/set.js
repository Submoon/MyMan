"use strict";
const answer = require('../model/database.js').answer;
const logger = require("../../utils/logger");

module.exports = class AutoMessageCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sets an automessage, which will be said by the bot everytime someone mentions you",
            usage: "answer_set message"
        }
    }

    async run() {
       let str = this.args.join(" ");
       let id = this.message.author.id;
       answer.set(id, str);
       logger.info(`Setting answer ${str} for user ${id}`);
       this.message.channel.send(`Message saved : ${str}`);
    }
}