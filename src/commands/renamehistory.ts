import { Message, User } from "discord.js";
import moment = require("moment");
import { IExtendedClient } from "../api";
import BaseCommand from "../basecommand";

export default class RenameHistoryCommand extends BaseCommand {

    public constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description() {
        return  {
            text: "Gets the last changes in the nickname of a user",
            usage: "lastrenamed",
        };
    }

    public async run() {
        const user = this.message.mentions.members.first();

        const auditLogs = await this.message.guild.fetchAuditLogs({
            type: 24,
        });

        const entries = auditLogs.entries.filter((log) =>
            log.targetType === "USER" && (log.target as User).id === user.id)
        .filter((log) => log.changes.some((c) => c.key === "nick"));
        const array = entries.array().slice(0, 10);
        let text = "";

        if (array.length === 0) {
            await this.message.channel.send(`User ${user.nickname} has never been renamed !`);
            return;
        }

        array.forEach((log) => {
            const change = log.changes.find((c) => c.key === "nick");
            const date = moment(log.createdAt).format("DD/MM/YYYY:HH[h]mm");

            text += `${date}\t[ ${change.old} => ${change.new}]\t`
                + `${log.reason ? log.reason : "No reason provided" }\n`;

        });

        await this.message.channel.send(text);
    }
}
