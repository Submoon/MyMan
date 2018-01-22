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
        let nameRole = `color{${id}}`;
        let [color] = this.args;

        let RoleFound = await this.message.guild.roles.find(Role => Role.name ==nameRole);

        if(RoleFound){
            logger.info(`Role ${roleFound} was found`);
            await RoleFound.setColor(color);
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
            await guild.setRolePosition(role, 1);  //Used to update the positions of the roles, Discord doesn't update it when a role is deleted
           
            let Bot = guild.member(this.client.user);
            let roleBot = Bot.highestRole;   

            let position = roleBot.position-1;
            logger.info(`Trying to set role ${role} postion to ${position}. Current position: ${roleBot.position}`);
            try {await guild.setRolePosition(role, position);}
            catch(error){                                                //Sometimes Discord refuses to change the role's position. It happens purely randomly
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