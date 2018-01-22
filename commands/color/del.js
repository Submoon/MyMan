"use strict";
const logger = require("../../utils/logger");

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
            logger.info(`Role ${roleFound} found`);
            await RoleFound.delete();
            logger.info(`Role ${roleFound} deleted`);
            this.message.channel.send("Role deleted.");
        }
        else
            logger.warn(`Role ${name} was not found`);
            this.message.channel.send("Couldn't find the role");


    }
}


    