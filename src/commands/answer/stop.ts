import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import AutoAnswer from "../../db/models/autoanswer";
import logger from "../../utils/logger";

export default class AutoStopCommand extends BaseCommand {
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Deletes the automessage",
            usage: "answer_stop",
        };
    }

    public async run() {
        const userId = this.message.author.id;
        const serverId = this.message.guild.id;
        const answer = await AutoAnswer.where<AutoAnswer>({
            serverId,
            userId,
        }).fetch();
        if (!answer) {
            logger.info(`No message to delete for user ${userId}`);
            await this.message.channel.send(`No message to delete`);
            return;
        }
        answer
            .destroy()
            .then(() => {
                logger.info(`Deleted automessage for user ${userId}`);
                return this.message.channel.send(`Deleted message`);
            })
            .catch((error) => {
                logger.error(error.message);
            });
    }
}
