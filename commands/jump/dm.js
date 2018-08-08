"use strict";
const dispo = require("../model/database").list;

module.exports = class JumpDMCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sends a private message to the list of users who are available.",
            usage: "jump_dm {message}"
        };
    }

    async run() {
        let author = this.message.member;
        let str = this.args.join(" ")
        
        for (var [key, value] of dispo) {
            if(value === 1 && this.message.guild === key.guild){
                key.send(author.user.username + " scheduled a jump. You can join the conversation here : " + this.message.channel + (this.args[0] ? "\r\rYou have been told : _" + str + "_" : ""));
            }
        }
    }
}
