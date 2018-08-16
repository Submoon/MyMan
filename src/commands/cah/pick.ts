import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahPickCommand extends BaseCommand {

    static get description() {
        return {
            text: "Allows to choose one or multiple cards to be played",
            usage: "cah_pick {x} {y}",
        } as IDescription;
    }

    public async run() {
        const cardIndexes = this.args.map(Number);

        gameManager.playerPicked(this.message.channel.id, this.message.author.id, cardIndexes)
        .catch((err: Error) => {
            this.message.channel.send(`Error: ${err.message}`);
        });
    }
}
