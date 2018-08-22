import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class PingCommand extends BaseCommand {
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Pings the server",
            usage: "ping",
        };
    }

    public async run() {
        const createdAt = this.message.createdTimestamp;
        const message = (await this.message.channel.send("Pong!")) as Message;
        const endTime = message.createdTimestamp;
        const diff = endTime - createdAt;
        message.edit(`Pong (${diff}ms)`);
        logger.info(`Received ping command, ping = ${diff}ms`);
    }
}
