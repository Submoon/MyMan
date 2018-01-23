"use strict";
const answer = require('../model/database.js').answer;
module.exports = class AutoStopCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Deletes the automessage",
            usage: "answer_stop"
        }
    }

    async run() {
       
       let id = this.message.author.id;
       if(answer.get(id)){
           answer.delete(id);
       }
       this.message.channel.send(`Deleted message`);
    }
}