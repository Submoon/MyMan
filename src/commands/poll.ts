import { CollectorFilter, Message } from "discord.js";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import Constants from "../utils/constants";
import logger from "../utils/logger";
const numbers = Constants.NUMBERS;

export default class PollCommand extends BaseCommand {
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Creates a poll for {x} seconds",
            usage: "poll {x} {choice1}; {choice2}; {choice3}",
        };
    }

    public async run() {
        const time = Number(this.args.shift());
        if (isNaN(time)) {
            await this.message.channel.send(`'${time}' is not a number`);
            return;
        }
        const timeNb = Number(time);
        // Only nine numbers
        const choices = this.args
            .join(" ")
            .split(";")
            .slice(0, 9);

        let text = "";
        // For each choice, we print it with the emoji associated
        for (let i = 0; i < choices.length; i++) {
            text += `${numbers[i]} : ${choices[i]}\n`;
        }

        const poll = (await this.message.channel.send(text)) as Message;
        // For each choice we add a possible react
        for (let i = 0; i < choices.length; i++) {
            await poll.react(`${numbers[i]}`);
        }

        // We don't care about other reacts than the numbers
        const filter: CollectorFilter = (reaction, user) =>
            numbers.some((n) => n === reaction.emoji.name);

        // We wait timeNb*1000 ms for the reactions
        poll.awaitReactions(filter, { time: timeNb * 1000 })
            .then((collected) => {
                let result = "";
                // For each choice, we get the number of votes
                for (let i = 0; i < choices.length; i++) {
                    const votes = collected.find(
                        (c) => c.emoji.name === numbers[i]
                    );

                    let count = 0;
                    // If there was no votes, it's null
                    if (votes) {
                        count = votes.count - 1; // -1 because the bot counts itself
                    }
                    result += `${count} votes for the option [${choices[i]}]\n`;
                }
                poll.channel.send(result);
            })
            .catch((exception) => {
                logger.error(exception);
                poll.channel.send(exception);
            });
    }
}
