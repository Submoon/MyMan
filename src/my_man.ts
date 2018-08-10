import * as Discord from "discord.js";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import {IConfig, IExtendedClient} from "./api";
import AutoAnswer from "./db/models/autoanswer";
import logger from "./utils/logger";

const client = new Discord.Client() as IExtendedClient;

client.config = (require("../config.json") as IConfig);

client.commands = [];

process.env.NODE_ENV = process.env.NODE_ENV || "development";

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir(path.join(__dirname, "./events/"), (err, files) => {
    if (err) { return logger.error(err.message); }
    logger.info(files.toString());
    files.forEach((file) => {
        const Event = require(`./events/${file}`);
        const eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) =>
        new Event(client, ...args).run()
        .catch((ex) => {
            logger.error(ex);
        }),
    );
});
});

const pattern = "**/*.js";

const commandFiles = glob.sync(pattern, {cwd: path.join(__dirname, "./commands/"), ignore: "**/model/**"});

logger.info(`Command files found: [${commandFiles}]`);

commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);

    const commandName = file.replace(/\//g, "_").split(".")[0];
    client.commands[commandName] = command;
    logger.info(`Command registered : ${commandName}`);

});

client.on("message", (message) => {
    if (message.author.bot) { return; }
    for (const [id, user] of message.mentions.users) {
        AutoAnswer.where<AutoAnswer>({userId: id, serverId: message.guild.id}).fetch().then((ans) => {
            if (ans) { message.channel.send(`${user} said : ${ans.toJSON().autoanswer}`); }
        });
    }
    if (message.content.indexOf(client.config.prefix) !== 0) { return; }

    // This is the best way to define args. Trust me.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        if (!client.commands[commandName]) {
            return;
        }
        const Command = client.commands[commandName];
        new Command(client, message, args)
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
