"use strict";
const answer = require('../model/database.js').answer;
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
       this.message.channel.send(`Message saved : ${str}`);
    }
}