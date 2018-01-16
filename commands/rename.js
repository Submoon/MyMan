"use strict";

module.exports = class RenameCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Changes the nickname of someone",
            usage: "rename {@username} {new nickname} {reason...}"
        };
    }

    async run() {
        let user = this.message.mentions.members.first();
        this.args.shift();
        let nick = this.args.shift();
        let reason = this.args.join(" ");
        if(!user){
            return this.message.channel.send("!rename @user new_pseudo reason");
        }
        user.setNickname(nick, reason)
        .then(usr =>{
            return this.message.channel.send(`Changed user's nickname to ${nick}`)
        })
        .catch(reason =>{
            return this.message.channel.send(`There has been an error: ${reason}`);
        });
    }
}


    