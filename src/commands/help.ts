"use strict";
import { CollectorFilter, Message, RichEmbed} from "discord.js";
import {ICommand, ICommandConstructor, IDescription, IExtendedClient} from "../api";
import BaseCommand from "../basecommand";
import { entries } from "../utils/arrayutils";
import Constants from "../utils/constants";
import logger from "../utils/logger";
const emojis = Constants.MENUACCEPTED;
/**
 * The help command manager
 */
export default class HelpCommand extends BaseCommand {

    public displayedPage: number;
    public constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return  {
            text: "Gets a list of commands",
            usage: "help or help {page number} or help {command}",
        };
    }

    /**
     * Runs the command
     */
    public async run() {
        // We check if it's a number or if there are no args
        const nb = Number(this.args[0]);
        if (this.args.length === 0 || !isNaN(nb)) {
            const page = !isNaN(nb) ? nb : 1;
            // If it's a number, we print the help page for this page number
            await this.sendMenu(page);
        } else {
            // If it's a string, we print the help page for this command
            await this.sendHelpForCommand(this.args[0]);
        }
    }

    /**
     * Sends an embed to the channel displaying help for a specific page
     * @param {number} page The page number
     */
    private async sendMenu(page: number) {
        const embed = this.getHelpPageEmbed(page);
        const author = this.message.author;
        const menu = await this.message.channel.send({embed}) as Message;
        for (const e of emojis) {
            await menu.react(`${e}`);
        }

        // Create a reaction collector
        const filter: CollectorFilter = (reaction, user) =>
            emojis.some((e) => e === reaction.emoji.name) && user.id === author.id;

        const collector = menu.createReactionCollector(filter, { time: 120000 });
        collector.on("collect", (r, collect)  => {
            logger.info(`Collected ${r.emoji.name}`);
            // Searching for the emoji index
            const index = emojis.indexOf(r.emoji.name);
            switch (index) {
                // If it's a number emoji
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    // We retrieve the commandName from the embed fields
                    const messageEmbed = r.message.embeds[0];
                    if (index < messageEmbed.fields.length) {
                        const concernedField = messageEmbed.fields[index];
                        // We retrieve the commandName by deleting the number emoji from the field's name
                        const commandName = concernedField.name.split(" ").splice(-1)[0];
                        logger.info(`That's the command ${commandName}!`);
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
                    // Forward arrow
                    r.message.delete();
                    this.sendMenu(++this.displayedPage);
                    break;
                case 7:
                    // X to exit help
                    r.message.delete();
                    break;
                default:
                logger.error("What are you doing here, little one?");
            }
        });
        collector.on("end", (collected, reason) => {
            logger.info(`Deleted collector because of ${reason}`);
            collector.message.delete();
        });
    }

    /**
     * Creates a help embed for a given command
     * @param {string} commandName The command name
     * @return {RichEmbed} The embed
     */
    private getHelpForCommand(commandName: string): RichEmbed {
        logger.debug(`Sending help for command ${commandName}`);
        const lowerCommandName = commandName.toLowerCase();
        const command = this.client.commands.get(lowerCommandName);
        let embed = new RichEmbed()
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot");
        if (command) {
            embed = embed.setTitle(lowerCommandName)
            .setDescription(command.description.text)
            .addField("Usage", command.description.usage);
        } else {
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
    private async sendHelpForCommand(commandName: string, returnPage: number = 1) {
        const embed = this.getHelpForCommand(commandName);
        const author = this.message.author;
        const menu = await this.message.channel.send({embed}) as Message;
        const acceptedForCommand = [emojis[5], emojis[7]];
        for (const [, react] of acceptedForCommand.entries()) {
            await menu.react(`${react}`);
        }

        // Create a reaction collector
        const filter: CollectorFilter = (reaction, user) => acceptedForCommand.some((e) => e === reaction.emoji.name)
            && user.id === author.id;
        const collector = menu.createReactionCollector(filter, { time: 120000 });
        collector.on("collect", (r, collect)  => {
            logger.info(`Collected ${r.emoji.name}`);
            // Searching for the emoji index
            const index = acceptedForCommand.indexOf(r.emoji.name);
            switch (index) {
                case 0:
                    // User clicked back
                    r.message.delete();
                    this.sendMenu(returnPage);
                    break;
                case 1:
                    // X to exit help
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
    private getHelpPageEmbed(page: number): RichEmbed {
        logger.debug(`Sending page ${page} of help`);

        // We should use a map
        const numberOfPages = Math.floor(this.client.commands.size / 5) + 1;
        let currentPage = page < numberOfPages ? page - 1 : numberOfPages - 1;
        currentPage = currentPage < 0 ? 0 : currentPage;
        this.displayedPage = currentPage + 1;

        let embed = new RichEmbed()
        .setTitle("Help")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setColor(0x00AE86)
        .setDescription("A list of all commands available for the bot")
        .setFooter(`Page ${currentPage + 1} out of ${numberOfPages}`);

        let i = 0;
        // 5 max fields...
        const mini = currentPage * 5;
        const maxi = mini + 4;
        const commandsToPrint = this.client.commands.entries()/*.slice(mini, maxi)*/;

        for (const [commandName, command] of commandsToPrint) {
            // Can't slice an associative array, this is a nightmare
            if (i < mini) {
                i++;
                continue;
            }
            if (i > maxi) {
                break;
            }
            const description = this.getStringDescriptionOfCommand(command);
            // Adds a field for this command's description and usage
            embed = embed.addField(`${emojis[i % 5]} ${commandName}`,  description, false); // Not inline
            i++;
        }
        return embed;
    }

    /**
     * Returns the description and usage of a command
     * @param {ICommand} command The command
     * @return {string} The description and usage
     */
    private getStringDescriptionOfCommand(command: ICommandConstructor): string {
        const commandStatic = command as any;
        return commandStatic.description ?
         `${commandStatic.description.text}; \nusage: ${commandStatic.description.usage}`
        : "No description provided";
    }
}
