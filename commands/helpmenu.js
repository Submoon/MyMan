"use strict";
const Discord = require("discord.js");
const entries = require("../utils/arrayutils").entries;
const logger = require("../utils/logger");
const emojis = require("../utils/constants").menuAccepted;

module.exports = class HelpMenuCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Gets a list and description of commands via a menu",
            usage: "helpmenu"
        };
    }

    async run() {
        await this.sendMenu(1);
    }

    async sendMenu(page){
        let embed = this.getHelpPageEmbed(page);
        let author = this.message.author; 
        let menu = await this.message.channel.send({embed});
        for(let i in emojis){
            await menu.react(`${emojis[i]}`);
        }
        
        // Create a reaction collector
        const filter = (reaction, user) => emojis.some(e => e === reaction.emoji.name) && user.id === author.id
        const collector = menu.createReactionCollector(filter, { time: 120000 });
        collector.on('collect', (r, collect)  => {
            logger.info(`Collected ${r.emoji.name}`);
            //Searching for the emoji index
            let index = emojis.indexOf(r.emoji.name);
            switch(index){
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    let embed = collect.message.embeds[0];
                    if(index<embed.fields.length){
                        let concernedField = embed.fields[index];
                        let commandName = concernedField.name.split(' ').splice(-1)[0];
                        logger.info(`That's the command ${commandName}!`)
                        collect.message.delete();
                        this.sendHelpForCommand(commandName, this.displayedPage);
                    }
                    break;
                case 5:
                    collect.message.delete();
                    this.sendMenu(--this.displayedPage);
                    break;
                case 6:
                    collect.message.delete();
                    this.sendMenu(++this.displayedPage);
                    break;
                case 7:
                    collect.message.delete();
                    break;
                default:
                    logger.error("What are you doing here, little one?");
            }
        });
    }

    getHelpForCommand(commandName){
        logger.debug(`Sending help for command ${commandName}`);
        let lowerCommandName = commandName.toLowerCase();
        let command = this.client.commands[lowerCommandName];
        let embed = new Discord.RichEmbed()
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
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

    async sendHelpForCommand(commandName, returnPage = 1){
        let embed = this.getHelpForCommand(commandName);
        let author = this.message.author; 
        let menu = await this.message.channel.send({embed});
        let acceptedForCommand = [emojis[5], emojis[7]];
        for(let i in acceptedForCommand){
            await menu.react(`${acceptedForCommand[i]}`);
        }
        
        // Create a reaction collector
        const filter = (reaction, user) => acceptedForCommand.some(e => e === reaction.emoji.name) && user.id === author.id
        const collector = menu.createReactionCollector(filter, { time: 120000 });
        collector.on('collect', (r, collect)  => {
            logger.info(`Collected ${r.emoji.name}`);
            //Searching for the emoji index
            let index = acceptedForCommand.indexOf(r.emoji.name);
            switch(index){
                case 0:
                    collect.message.delete();
                    this.sendMenu(returnPage);
                    break;
                case 1:
                    collect.message.delete();
                    break;
                default:
                    logger.error("What are you doing here, little one?");
            }
        });
    }

    getHelpPageEmbed(page){

        logger.debug(`Sending page ${page} of help`);

        //We should use a map
        var numberOfPages = Math.floor(Object.keys(this.client.commands).length / 5)+1;
        var currentPage = page < numberOfPages ? page-1: numberOfPages-1;
        currentPage = currentPage < 0 ? 0 : currentPage;
        this.displayedPage = currentPage+1;

        let embed = new Discord.RichEmbed()
        .setTitle("Help")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot")
        .setFooter(`Page ${currentPage+1} out of ${numberOfPages}`);

        let i = 0;
        //25 max fields...
        let mini = currentPage*5;
        let maxi = mini+4;
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
            embed = embed.addField(`${emojis[i%5]} ${commandName}`,  description, false); //Not inline
            i++;
        }
        return embed;
    }

    getStringDescriptionOfCommand(command){
        return command.description ? `${command.description.text}; \nusage: ${command.description.usage}` : "No description provided";
    }
}


    