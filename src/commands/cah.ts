import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class CardCommand extends BaseCommand {
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
            text: "Allows the user to play a game of Cards Against Humanity",
            usage: "cah_choose, cah_join, cah_leave, cah_pick, cah_score, cah_start, cah_stop",
        };
    }

    public async run() {}
}