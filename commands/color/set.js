"use strict";
const logger = require("../../utils/logger");

module.exports = class ColorSetCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Creates a role linked to the user, and set the role's color to the given color",
            usage: "color_set color"
        };
    }

    async run() {

        let guild = this.message.guild;
        let id = this.message.author.id;
        let position = 1;
        let nameRole = `color{${id}}`;
        let [color] = this.args;

        if(!color){
            color = "RANDOM";
        }
        let roleFound = await this.message.guild.roles.find(Role => Role.name ==nameRole);

        if(roleFound){
            logger.info(`Role ${roleFound} was found`);
            await roleFound.setColor(color);
            logger.info(`Changing color of role ${roleFound} to ${color}`);
        }
        else{
            logger.info(`Role ${nameRole} was not found`);
  
            let argrole = {
                name : nameRole,
                color : color
            }

            logger.info(`Creating role ${argrole}`);
            let role = await this.message.guild.createRole(argrole);
            logger.info(`role ${role} created`);
            logger.debug(`Updating positions of all roles`);
            guild.setRolePosition(role, position);
            
            let bot = guild.member(this.client.user);
            let roleBot = bot.highestRole;

            position = roleBot.position-1;
            logger.info(`Trying to set role ${role} postion to ${position}. Current position: ${roleBot.position}`);

            try {guild.setRolePosition(role, position);}
            catch(error){                                                //In case Discord refuses to change the role's position. Unlikely to happen.
                logger.error(`Error while setting role ${role} position to ${position}. Position is still ${role.position}`);
                logger.error(`Deleting ${role}`);
                await role.delete();                                           //Deleting the role and using again the set command makes it work
                this.message.channel.send("Error, please try again"); 
                return;
            }
            let user = guild.member(this.message.author);
            await user.addRole(role);     
            logger.info(`role ${role} given to user ${user}`);
            this.message.channel.send("New color given !"); 
        }
    }
}  