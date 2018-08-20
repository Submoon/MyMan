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
            text: "Allows to start a cah game",
            usage: "cah_start",
        } as IDescription;
    }

    public async run() {
        gameManager
            .createGame(this.message.channel as TextChannel)
            .then((game) => {
                const text = `Game started for channel ${game.channel}
            Please join the game by using cah_join`;
                this.message.channel.send(text);
            })
            .catch((error) => {
                this.message.channel.send("Error: " + error);
            });
    }
}
