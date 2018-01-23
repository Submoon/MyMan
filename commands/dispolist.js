"use strict";
const dispo = require("./model/auto").list;

module.exports = class DispoListCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Returns a list of users who are available.",
            usage: "dispolist"
        };
    }

    async run() {
        this.message.channel.send("Voici la liste des joueurs disponibles : ");
        // We are going through the 'dispo' map to return only the players with the disponibility value '1'.
        for (var [key, value] of dispo) {
            if(value === 1){
                this.message.channel.send("**" + key + "**");
            }
          }
    }
}