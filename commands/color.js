"use strict";

module.exports = class ColorCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Gives the given color to the user",
            usage: "color wantedcolor"
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
            let bot = this.client.user;
            let BotFound = guild.members.find(GuildMember => GuildMember.id ==bot.id);     
            let roleBot = BotFound.highestRole;   
  
            let argrole = {
                name : nameRole
            }
            let role = await this.message.guild.createRole(argrole);
            await guild.setRolePosition(role, 1);
           

            let position = roleBot.position-1;
            await guild.setRolePosition(role, position);
            try{
                role.setColor(color);
            }
            catch(error){
                this.message.channel.send("Incorrect color");
                return;
            }
            
            let UserFound = await guild.members.find(GuildMember => GuildMember.id ==id);
            UserFound.addRole(role);     

        }

    }
}


    