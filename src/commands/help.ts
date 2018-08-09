"use strict";
import { RichEmbed, Message } from "discord.js";
import { entries } from "../utils/arrayutils";
import logger from "../utils/logger";
import {ICommand, BaseCommand} from '../api';
import Constants from '../utils/constants';
const emojis = Constants.MENUACCEPTED
/**
 * The help command manager
 */
export default class HelpCommand extends BaseCommand{

    public displayedPage: number;
    constructor(client, message, args){
        super(client, message, args);
    }

    static get description(){
        return  {
            text:"Gets a list of commands",
            usage: "help or help {page number} or help {command}"
        };
    }


    /**
     * Runs the command
     */
    async run() {
        //We check if it's a number or if there are no args
        const nb = Number(this.args[0]);
        if(this.args.length==0 || !isNaN(nb)){
            let page = !isNaN(nb) ? nb : 1;
            // If it's a number, we print the help page for this page number
            await this.sendMenu(page);
        }else{
            // If it's a string, we print the help page for this command
            await this.sendHelpForCommand(this.args[0]);
        }
    }

    /**
     * Sends an embed to the channel displaying help for a specific page
     * @param {number} page The page number
     */
    async sendMenu(page){
        let embed = this.getHelpPageEmbed(page);
        let author = this.message.author; 
        let menu = await this.message.channel.send({embed}) as Message;
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
                //If it's a number emoji
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    // We retrieve the commandName from the embed fields
                    let embed = r.message.embeds[0];
                    if(index<embed.fields.length){
                        let concernedField = embed.fields[index];
                        // We retrieve the commandName by deleting the number emoji from the field's name
                        let commandName = concernedField.name.split(' ').splice(-1)[0];
                        logger.info(`That's the command ${commandName}!`)
                        r.message.delete();
                        this.sendHelpForCommand(commandName, this.displayedPage);
                    }
                    break;
                case 5:
                    // Backward arrow
                    r.message.delete();
                    this.sendMenu(--this.displayedPage);
                    break;
                case 6:
                    //Forward arrow 
                    r.message.delete();
                    this.sendMenu(++this.displayedPage);
                    break;
                case 7:
                    //X to exit help
                    r.message.delete();
                    break;
                default:
                logger.error("What are you doing here, little one?");
            }
        });
    }

    /**
     * Creates a help embed for a given command
     * @param {string} commandName The command name
     * @return {RichEmbed} The embed
     */
    getHelpForCommand(commandName){
        logger.debug(`Sending help for command ${commandName}`);
        let lowerCommandName = commandName.toLowerCase();
        let command = this.client.commands[lowerCommandName];
        let embed = new RichEmbed()
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

    /**
     * Sends an embed for the help page of a command in the current channel
     * @param {string} commandName The command name
     * @param {number} returnPage The page which will be displayed if the user click return
     */
    async sendHelpForCommand(commandName, returnPage = 1){
        let embed = this.getHelpForCommand(commandName);
        let author = this.message.author; 
        let menu = await this.message.channel.send({embed}) as Message;
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
                    //User clicked back
                    r.message.delete();
                    this.sendMenu(returnPage);
                    break;
                case 1:
                    //X to exit help
                    r.message.delete();
                    break;
                default:
                    logger.error("What are you doing here, little one?");
            }
        });
    }

    /**
     * Generates an help embed for a specific page
     * @param {number} page The page number
     * @return {RichEmbed} The embed
     */
    getHelpPageEmbed(page){
        logger.debug(`Sending page ${page} of help`);

        //We should use a map
        var numberOfPages = Math.floor(Object.keys(this.client.commands).length / 5)+1;
        var currentPage = page < numberOfPages ? page-1: numberOfPages-1;
        currentPage = currentPage < 0 ? 0 : currentPage;
        this.displayedPage = currentPage+1;

        let embed = new RichEmbed()
        .setTitle("Help")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot")
        .setFooter(`Page ${currentPage+1} out of ${numberOfPages}`);

        let i = 0;
        //5 max fields...
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
            //Adds a field for this command's description and usage
            embed = embed.addField(`${emojis[i%5]} ${commandName}`,  description, false); //Not inline
            i++;
        }
        return embed;
    }

    /**
     * Returns the description and usage of a command
     * @param {ICommand} command The command
     * @return {string} The description and usage
     */
    getStringDescriptionOfCommand(command: ICommand): string{
        return command.description ? `${command.description.text}; \nusage: ${command.description.usage}` : "No description provided";
    }
}


    