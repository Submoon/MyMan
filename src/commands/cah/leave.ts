import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahLeaveCommand extends BaseCommand {
    static get description(): IDescription {
        return {
            text: "Allows to leave a cah game",
            usage: "cah_leave",
        };
    }

    public async run() {
        const channelId = this.message.channel.id;
        const user = this.message.author;
        gameManager
            .playerLeave(channelId, user.id)
            .then(() => {
                this.message.channel.send(`Player ${user} left the game`);
            })
            .catch((error: Error) => {
                this.message.channel.send("Error: " + error.message);
            });
    }
}
