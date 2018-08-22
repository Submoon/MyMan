import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahPickCommand extends BaseCommand {
    static get description(): IDescription {
        return {
            text: "Allows to choose one or multiple cards to be played",
            usage: "cah_pick {x} {y}",
        };
    }

    public async run() {
        const cardIndexes = this.args.map(Number);

        gameManager
            .playerPicked(
                this.message.channel.id,
                this.message.author.id,
                cardIndexes
            )
            .then((result) => {
                if (result === true) {
                    this.message.react("👌");
                }
            })
            .catch((err: Error) => {
                this.message.channel.send(`Error: ${err.message}`);
            });
    }
}
