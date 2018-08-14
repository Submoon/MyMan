import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahStopCommand extends BaseCommand {

    static get description() {
        return  {
            text: "Allows to stop a cah game",
            usage: "cah_stop",
        } as IDescription;
    }

    public async run() {
        gameManager.destroyGame(this.message.channel.id)
        .then((channelId) => {
            this.message.channel.send(`Game stopped for channel ${channelId}`);
        }).catch((error) => {
            this.message.channel.send("Error: " + error);
        });
    }
}
