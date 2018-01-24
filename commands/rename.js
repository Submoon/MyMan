"use strict";
const logger = require("../utils/logger");

module.exports = class RenameCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Changes the nickname of someone",
            usage: "rename {@username} {new nickname} ; {reason...}"
        };
    }

    async run() {
        let user = this.message.mentions.members.first();
        this.args.shift();
        let argsSeperated = this.args.join(" ").split(";");
        let nick = argsSeperated.shift().trim();
        let reason = argsSeperated.join("");
        if(!user){
            return this.message.channel.send("!rename @user new_pseudo reason");
        }
        user.setNickname(nick, reason)
        .then(usr =>{
            return this.message.channel.send(`Changed user's nickname to ${nick}`)
        })
        .catch(reason =>{
            logger.error(reason);
            return this.message.channel.send(`There has been an error: ${reason}`);
        });
    }
}


    