import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahScoreCommand extends BaseCommand {
    static get description() {
        return {
            text: "Displays the score for the current CAH game",
            usage: "cah_score",
        } as IDescription;
    }

    public async run() {
        gameManager
            .displayScore(this.message.channel.id)
            .catch((err: Error) => {
                this.message.channel.send(`Error: ${err.message}`);
            });
    }
}
