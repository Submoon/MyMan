import { Message } from "discord.js";
import { IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import {dispoList as dispo} from "../model/database";

export default class JumpDispoCommand extends BaseCommand {

    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description() {
        return  {
            text: "Sets the user's available status.",
            usage: "jump_dispo {0 or 1}",
        };
    }

    public async run() {
        const avail = Number(this.args[0]);
        const author = this.message.member;

        // Control of the disponibility's value.
        if (avail === 1 || avail === 0) {
            // Control of redundant cases.
            if (dispo.get(author) === avail) {
                const statusAlready = "You already have the status **"
                    + (avail === 1 ? "available" : "unavailable") + "**.";
                this.message.channel.send(statusAlready);
            } else {
                this.message.channel.send("The disponibility has been modified. You are now **"
                + (avail === 1 ? "available" : "unavailable") + "**." );
                dispo.set(author, avail);
            }
        } else {
            this.message.channel.send("The disponibility has not been recognized.");
        }
    }
}
