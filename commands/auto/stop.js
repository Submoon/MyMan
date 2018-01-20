"use strict";
const auto = require('../auto.js');
module.exports = class AutoStopCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Deletes the automessage",
            usage: "auto_stop"
        }
    }

    async run() {
       
       let id = this.message.author.id;
       if(auto.answer.get(id)){
           auto.answer.delete(id);
       }
       this.message.channel.send(`Deleted message`);
    }
}