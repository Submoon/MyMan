import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import AutoAnswer from "../../db/models/autoanswer";
import logger from "../../utils/logger";

export default class AutoMessageCommand extends BaseCommand {

  constructor(client: IExtendedClient, message: Message, args: string[]) {
    super(client, message, args);
  }

  static get description(): IDescription {
    return {
      text:
        "Sets an automessage, which will be said by the bot everytime someone mentions you",
      usage: "answer_set message",
    } as IDescription;
  }

  public async run() {
    const message = this.args.join(" ");
    const userId = this.message.author.id;
    const serverId = this.message.guild.id;
    // answer.set(userId, message);
    const ans = await AutoAnswer.where<AutoAnswer>({
      serverId, userId,
    }).fetch();

    if (ans) {
        await ans.save({autoanswer: message});
    } else {
        await new AutoAnswer({
          autoanswer: message,
          serverId,
          userId,
          }).save();
    }

    logger.info(`Setting answer ${message} for user ${userId}`);
    this.message.channel.send(`Message saved : ${message}`);
  }
}
