"use strict";
import {
    CategoryChannel,
    Message,
    TextChannel,
    VoiceChannel,
} from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class NewChannelCommand extends BaseCommand {
    public constructor(
        client: IExtendedClient,
        message: Message,
        args: string[]
    ) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text:
                "Creates a new channel (text voice or category)," +
                "sets the topic and puts the channel in the given category",
            usage: "newchan option; name; topic; parent",
        };
    }

    public async run() {
        const guild = this.message.guild;
        const argsSeperated = this.args.join(" ").split(";");
        const type = argsSeperated.shift() as "category" | "text" | "voice";
        const name = argsSeperated.shift();
        const topic = argsSeperated.shift();
        const parent = argsSeperated.shift();
        let chan: CategoryChannel | TextChannel | VoiceChannel;
        try {
            chan = await guild.createChannel(name, type);
        } catch (error) {
            logger.error(error);
            this.message.channel.send(
                "Use only alphanumerical characters for the name of the text channel"
            );
            return;
        }
        chan.setTopic(topic);
        if (parent && type !== "category") {
            const parentFound = guild.channels.find(
                (channel) =>
                    channel.type == null &&
                    channel.name.toLowerCase() === parent.toLowerCase()
            );

            if (parentFound) {
                logger.debug(
                    `Found parent ${parentFound}, setting it as a parent for channel${chan}`
                );
                chan.setParent(parentFound.id);
            } else {
                const par = await guild.createChannel(parent, "category");
                logger.debug(
                    `Parent ${par} created, setting it as a parent for channel${chan}`
                );
                await chan.setParent(par);
            }
        }
        logger.info(`Channel created : ${chan}`);
        this.message.channel.send(`Channel created : ${chan}`);
    }
}
