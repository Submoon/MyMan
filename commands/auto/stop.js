"use strict";
const auto = require('../model/auto.js');
const logger = require("../../utils/logger");

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
       if(auto.answer.delete(id)){
           logger.info(`Deleted automessage for user ${id}`);
            return this.message.channel.send(`Deleted message`);
       }
       logger.info(`No message to delete for user ${id}`);
       return this.message.channel.send(`No message to delete`);
    }
}