import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import logger from "../../utils/logger";

export default class ColorDelSubCommand extends BaseCommand {
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Deletes the color role linked to the user",
            usage: "color_del",
        };
    }

    public async run() {
        const id = this.message.author.id;
        const name = `color{${id}}`;
        const roleFound = this.message.guild.roles.find(
            (role) => role.name === name
        );
        if (roleFound) {
            logger.info(`Role ${roleFound} found`);
            await roleFound.delete();
            logger.info(`Role ${roleFound} deleted`);
            this.message.channel.send("Role deleted.");
        } else {
            logger.warn(`Role ${name} was not found`);
            this.message.channel.send("Couldn't find the role");
        }
    }
}
