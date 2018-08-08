"use strict";
const logger = require("../../utils/logger");
const Answer = require("../../db/models/autoanswer");

module.exports = class AutoMessageCommand {
  constructor(client, message, args) {
    this.client = client;
    this.message = message;
    this.args = args;
  }

  static get description() {
    return {
      text:
        "Sets an automessage, which will be said by the bot everytime someone mentions you",
      usage: "answer_set message"
    };
  }

  async run() {
    let message = this.args.join(" ");
    let userId = this.message.author.id;
    let serverId = this.message.guild.id;
    // answer.set(userId, message);
    let ans = await Answer.where({
       userId: userId, serverId: serverId
    }).fetch()
    
    if (ans) {
        await ans.save({autoanswer: message})
    } else {
        await new Answer({
            userId: userId,
            serverId: serverId,
            autoanswer: message
          }).save();
    }
    

    logger.info(`Setting answer ${message} for user ${userId}`);
    this.message.channel.send(`Message saved : ${message}`);
  }
};
