import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CardStopSubCommand extends BaseCommand {
    static get description(): IDescription {
        return {
            text: "Allows to stop a cah game",
            usage: "cah_stop",
        };
    }

    public async run() {
        gameManager
            .destroyGame(this.message.channel.id)
            .then((channel) => {
                this.message.channel.send(
                    `Game stopped for channel ${channel}`
                );
            })
            .catch((error: Error) => {
                this.message.channel.send("Error: " + error.message);
            });
    }
}
