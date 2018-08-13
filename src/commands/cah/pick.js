"use strict";
module.exports = class CahPickCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Allows to choose one or multiple cards to be played",
            usage: "cah_pick {x} {y}"
        };
    }

    async run() {
        this.message.channel.send("Not implemented yet!");
    }
}
