"use strict";

module.exports = class PingCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Makes the bot leave the vocal channel it's connected to",
            usage: "vc_leave"
        };
    }

    async run() {
        let member = this.message.member;
        let vC = member.voiceChannel;
        if(vC)
            vC.leave();
        else 
            this.message.channel.send("You need to be on a voice channel");
    }
}


    