import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class ColorCommand extends BaseCommand {
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
            text: "Allows users to change their name's color.",
            usage: "color_del, color_list, color_set",
        };
    }

    public async run() {}
}