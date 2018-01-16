"use strict";
const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

client.config = require("./config.json");

let commands = [];

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let Event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      client.on(eventName, (...args) => new Event(client, ...args).run());
    });
  });

  fs.readdir("./commands", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let command = require(`./commands/${file}`);

      let commandName = file.split(".")[0];
      commands[commandName] = command;
    });
  });
  
  client.on("message", message => {
    if (message.author.bot) return;
    if(message.content.indexOf(client.config.prefix) !== 0) return;
  
    // This is the best way to define args. Trust me.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
  
    // The list of if/else is replaced with those simple 2 lines:
    try {
      const Command = commands[commandName];
      new Command(client, message, args).run();
    } catch (err) {
      console.error(err);
    }
  });

client.login(client.config.token);