"use strict";
const dispo = require("./model/database").list;

module.exports = class JumpDispoCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sets the user's available status.",
            usage: "jump_dispo {0 or 1}"
        };
    }

    async run() {
        const avail = Number(this.args[0]);
        let author = this.message.author;
        
        // Control of the disponibility's value.
        if(avail === 1 || avail === 0){
            // Control of redundant cases.
            if(dispo.get(author) === avail){
                this.message.channel.send("You already have the status **" + (avail === 1 ? "available" : "unavailable") + "**.")
            }else{
                this.message.channel.send("The disponibility has been modified. You are now **" + (avail === 1 ? "available" : "unavailable") + "**." );
                dispo.set(author, avail);
            }
        }else{
            this.message.channel.send("The disponibility has not been recognized.");
        }
    }
}
