import * as Discord from "discord.js";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import {ICommandConstructor, IConfig, IEvent, IEventConstructor, IExtendedClient} from "./api";
import AutoAnswer from "./db/models/autoanswer";
import logger from "./utils/logger";

const client = new Discord.Client() as IExtendedClient;

client.config = (require("../config.json") as IConfig);

client.commands = new Map<string, ICommandConstructor>();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const pattern = "**/*.js";

const eventFiles = glob.sync(pattern, {cwd: path.join(__dirname, "./events/")});

eventFiles.forEach((file) => {
    const eventClass = require(`./events/${file}`).default as IEventConstructor;
    const eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args: any[]) => {
        new eventClass(client, ...args).run();
    });
});

const commandFiles = glob.sync(pattern, {cwd: path.join(__dirname, "./commands/")});

logger.info(`Command files found: [${commandFiles}]`);

commandFiles.forEach((file) => {
    const commandClass = require(`./commands/${file}`).default as ICommandConstructor;

    const commandName = file.replace(/\//g, "_").split(".")[0];
    client.commands.set(commandName, commandClass);
    logger.info(`Command registered : ${commandName}`);

});

client.on("message", (message) => {
    if (message.author.bot) { return; }
    for (const [id, user] of message.mentions.users) {
        AutoAnswer.where<AutoAnswer>({userId: id, serverId: message.guild.id}).fetch()
        .then((ans) => {
            if (ans) { message.channel.send(`${user} said : ${ans.toJSON().autoanswer}`); }
        }).catch((e) => {
            logger.error(`Error while trying to access to autoanswers ${e.message}`);
        });
    }
    if (message.content.indexOf(client.config.prefix) !== 0) { return; }

    // This is the best way to define args. Trust me.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        if (!client.commands.has(commandName)) {
            return;
        }
        const commandClass = client.commands.get(commandName);
        new commandClass(client, message, args)
        .run()
        .then(() => {
            // Everything is fine
        })
        .catch((ex) => {
            logger.error(ex);
        });
    } catch (err) {
        logger.error(err);
    }
});

client.login(client.config.token);
