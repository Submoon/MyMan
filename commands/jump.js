"use strict";
const dispo = require("./model/database").list;

module.exports = class JumpCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sends a private message to the list of users who are available.",
            usage: "jump {message}"
        };
    }

    async run() {
        let author = this.message.author;
        let str = this.args.join(" ")
        
        for (var [key, value] of dispo) {
            if(value === 1){
                key.send(author.username + " scheduled a jump. " + (this.args[0] ? "\r\rYou have been told : _" + str + "_" : ""));
            }
        }
    }
}
