"use strict";

module.exports = class ColorDelCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Deletes the color role linked to the user",
            usage: "color_del"
        };
    }

    async run() {
        let id = this.message.author.id;
        let name = `color{${id}}`;
        let RoleFound = this.message.guild.roles.find(Role => Role.name ==name);
        if(RoleFound){
            RoleFound.delete();
            this.message.channel.send("Role deleted.");
        }
        else
            this.message.channel.send("Couldn't find the role");


    }
}


    