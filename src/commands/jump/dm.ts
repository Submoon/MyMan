import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import {dispoList as dispo} from "../model/database";

export default class JumpDMCommand extends BaseCommand {

    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return  {
            text: "Sends a private message to the list of users who are available.",
            usage: "jump_dm {message}",
        } as IDescription;
    }

    public async run() {
        const author = this.message.member;
        const str = this.args.join(" ");

        for (const [key, value] of dispo) {
            if (value === 1 && this.message.guild === key.guild) {
                key.send(author.user.username
                    + " scheduled a jump. You can join the conversation here : "
                    + this.message.channel + (this.args[0] ? "\r\rYou have been told : _" + str + "_" : ""));
            }
        }
    }
}
