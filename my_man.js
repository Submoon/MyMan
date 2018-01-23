"use strict";
const Discord = require("discord.js");
const fs = require("fs");
const _ = require("lodash");
const glob = require("glob");
const auto = require('./commands/model/auto.js');
const logger = require('./utils/logger');


const client = new Discord.Client();

client.config = require("./config.json");

client.commands = {};

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return logger.error(err);
    files.forEach(file => {
      let Event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      client.on(eventName, (...args) =>
       new Event(client, ...args).run()
        .catch(ex => {
            logger.error(ex);
        })
    );
    });
  });

let pattern = "**/*.js";

let commandFiles = glob.sync(pattern, {cwd: "./commands/", ignore: "**/model/**"});

logger.info(`Command files found: [${commandFiles}]`);

commandFiles.forEach(file => {
  let command = require(`./commands/${file}`);

  let commandName = file.replace(/\//g, "_").split(".")[0];
  client.commands[commandName] = command;
  logger.info(`Command registered : ${commandName}`);

});

// fs.readdir("./commands", (err, files) => {
//   if (err) return logger.error(err);
//   files.forEach(file => {
//     let command = require(`./commands/${file}`);

//     let commandName = file.split(".")[0];
//     client.commands[commandName] = command;
//   });
// });

client.on("message", message => {
  if (message.author.bot) return;
  for(let [id, user] of message.mentions.users){
    if(auto.answer.get(id))
        message.channel.send(`${user} said : ${auto.answer.get(id)}`)
  }
  if(message.content.indexOf(client.config.prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
      if(!client.commands[commandName]){
          return;
      }
    const Command = client.commands[commandName];
    new Command(client, message, args)
    .run()
    .then(()=>{
      // Everything is fine
    })
    .catch(ex => {
      logger.error(ex);
    });
  } catch (err) {
    logger.error(err);
  }
});

client.login(client.config.token);