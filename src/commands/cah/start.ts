import { Message, TextChannel } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahStartCommand extends BaseCommand {
    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description() {
        return {
            text:
                "Allows to start a cah game. First to {x} wins. Defaults to 10.",
            usage: "cah_start {x?}",
        } as IDescription;
    }

    public async run() {
        const arg1 = Number(this.args.shift());

        const requiredWins = isNaN(arg1) ? 10 : arg1;
        gameManager
            .createGame(this.message.channel as TextChannel, requiredWins)
            .then((game) => {
                const text =
                    `Game started for channel ${game.channel}\n` +
                    `You will need ${requiredWins} to win.\n` +
                    `Please join the game by using cah_join`;
                this.message.channel.send(text);
            })
            .catch((error) => {
                this.message.channel.send("Error: " + error);
            });
    }
}
