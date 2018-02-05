"use strict";
const Discord = require("discord.js");
const entries = require("../utils/arrayutils").entries;
const logger = require("../utils/logger");

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
        const nb = Number(this.args[0]);
        let embed = null;
        if(this.args.length==0 || !isNaN(nb)){
            let page = !isNaN(nb) ? nb : 1;
            embed = this.getHelpPageEmbed(page);
        }else{
            embed = this.getHelpForCommand(this.args[0]);
        }
        

        let author = this.message.author; 
        author.send({embed});
       

        
    }

    getHelpForCommand(commandName){
        logger.debug(`Sending help for command ${commandName}`);
        let lowerCommandName = commandName.toLowerCase();
        let command = this.client.commands[lowerCommandName];
        let embed = new Discord.RichEmbed()
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot");
        if(command){
            embed = embed.setTitle(lowerCommandName)
            .setDescription(command.description.text)
            .addField("Usage", command.description.usage);
        }else{
            embed = embed.setTitle(`Unknown command ${lowerCommandName}`)
            .setDescription(`Unknown command ${lowerCommandName}`);
        }
        return embed;


    }

    getHelpPageEmbed(page){

        logger.debug(`Sending page ${page} of help`);

        //We should use a map
        var numberOfPages = Math.floor(Object.keys(this.client.commands).length / 25)+1;
        var currentPage = page < numberOfPages ? page-1: numberOfPages-1;
        

        let embed = new Discord.RichEmbed()
        .setTitle("Help")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot")
        .setFooter(`Page ${currentPage+1} out of ${numberOfPages}`);

        let i = 0;
        //25 max fields...
        let mini = currentPage*25;
        let maxi = mini+24;
        let commandsToPrint = entries(this.client.commands)/*.slice(mini, maxi)*/;

        for (let [commandName, command] of commandsToPrint) {
            //Can't slice an associative array, this is a nightmare
            if(i < mini){
                i++;
                continue;
            }
            if(i>maxi) {
                break;
            }

            let description = this.getStringDescriptionOfCommand(command);
            embed = embed.addField(commandName,  description, true);
            
        }
        return embed;
    }

    getStringDescriptionOfCommand(command){
        return command.description ? `${command.description.text}; \nusage: ${command.description.usage}` : "No description provided";
    }


}


    