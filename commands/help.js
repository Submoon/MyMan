"use strict";
const Discord = require("discord.js");
const entries = require("../utils/arrayutils").entries;

module.exports = class HelpCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Gets a list of commands",
            usage: "help {page number} or help {command}"
        };
    }

    async run() {

        let page = this.args[0] ? this.args[0] : 1;

        let embed = this.getHelpPageEmbed(page);
      
       this.message.channel.send({embed});

        
    }

    getHelpPageEmbed(page){

        let numberOfPages = Math.floor(this.client.commands.length / 25)+1;
        // console.log(this.client.commands);
        let currentPage = page < numberOfPages ? page-1: numberOfPages-1;

        

        // console.log(`currentPage ${currentPage}`);
        // console.log(commandsToPrint);

        let embed = new Discord.RichEmbed()
        .setTitle("Help")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot")
        .setFooter(`Page ${currentPage+1} out of ${numberOfPages}`)

        let i = 0;
        let mini = currentPage*25;
        let maxi = mini+24;
        let commandsToPrint = entries(this.client.commands)/*.slice(mini, maxi)*/;

        for (let [commandName, command] of commandsToPrint) {
            if(i < mini){
                i++;
                continue;
            }
            if(i>maxi) {
                break;
            }

            let description = command.description ? `${command.description.text}; \nusage: ${command.description.usage}` : "No description provided";
            embed = embed.addField(commandName,  description, true);
            
        }
        return embed;
    }


}


    