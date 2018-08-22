import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class RenameCommand extends BaseCommand {
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Changes the nickname of someone",
            usage: "rename {@username} {new nickname} ; {reason...}",
        };
    }

    public async run() {
        const user = this.message.mentions.members.first();
        this.args.shift();
        const argsSeperated = this.args.join(" ").split(";");
        const nick = argsSeperated.shift().trim();
        const reason = argsSeperated.join("");
        if (!user) {
            await this.message.channel.send("!rename @user new_pseudo reason");
            return;
        }
        user.setNickname(nick, reason)
            .then((usr) => {
                this.message.channel
                    .send(`Changed user's nickname to ${nick}`)
                    .then(() => {
                        return;
                    });
                return;
            })
            .catch((error) => {
                logger.error(error);
                return this.message.channel.send(
                    `There has been an error: ${error}`
                );
            });
    }
}
