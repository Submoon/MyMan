"use strict";
const logger = require("../../utils/logger");
const Answer = require("../../db/models/autoanswer");

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
       
        let userId = this.message.author.id;
        let serverId = this.message.guild.id;
        let answer = await Answer.where({
            userId: userId, 
            serverId: serverId
        }).fetch();
        if(!answer){
            logger.info(`No message to delete for user ${userId}`);
            return this.message.channel.send(`No message to delete`);
        }
        answer.destroy().then(() => {
           logger.info(`Deleted automessage for user ${userId}`);
            return this.message.channel.send(`Deleted message`);
        }).catch(error => {
            logger.error(error.message);
        });
        
    }
}