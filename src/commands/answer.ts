import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class AnswerCommand extends BaseCommand {
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
            text: "Allows the user to have an automessage written by the bot when someone mentions this user",
            usage: "answer_set, answer_stop",
        };
    }

    public async run() {}
}