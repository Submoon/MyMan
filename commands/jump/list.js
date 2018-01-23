"use strict";
const dispo = require("../model/database").list;

module.exports = class JumpListCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Returns a list of users who are available.",
            usage: "jump_list"
        };
    }

    async run() {
        let author = this.message.author;
        if(dispo.length){
            this.message.channel.send("Here is the list of all available players : ");
            // We are going through the 'dispo' map to return only the players with the disponibility value '1'.
            for (var [key, value] of dispo) {
                if(value === 1){
                    this.message.channel.send("**" + key.username + "**");
                }
              }
        }else{
            this.message.channel.send("There is no one available at the moment.");
        }
        
    }
}
