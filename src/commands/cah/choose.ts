import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahChooseCommand extends BaseCommand {
    static get description(): IDescription {
        return {
            text: "Allows the card czar to choose the winner",
            usage: "cah_choose {x}",
        };
    }

    public async run() {
        const winnerIndex = Number(this.args.shift());

        gameManager
            .czarChose(
                this.message.channel.id,
                this.message.author.id,
                winnerIndex
            )
            .catch((err: Error) => {
                this.message.channel.send(`Error: ${err.message}`);
            });
    }
}
