import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class JumpCommand extends BaseCommand {
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
            text: "Allows the user to volunteer for an event and to manage the volunteers",
            usage: "jump_dispo, jump_dm, jump_list",
        };
    }

    public async run() {}
}