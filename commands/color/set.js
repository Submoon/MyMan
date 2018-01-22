"use strict";

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
            await RoleFound.setColor(color);
        }
        else{
            let Bot = guild.member(this.client.user);
            let roleBot = Bot.highestRole;   
  
            let argrole = {
                name : nameRole,
                color : color
            }
            let role = await this.message.guild.createRole(argrole);
            await guild.setRolePosition(role, 1);  //Used to update the positions of the roles, Discord doesn't update it when a role is deleted
           
            let position = roleBot.position-1;
            try {await guild.setRolePosition(role, position);}
            catch(error){                                                //Sometimes Discord refuses to change the role's position. It happens purely randomly
                role.delete();                                           //Deleting the role and using again the set command makes it work
                this.message.channel.send("Error, please try again"); 
                return;
            }
            let User = guild.member(this.message.author);
            User.addRole(role);     
        }
    }
}  