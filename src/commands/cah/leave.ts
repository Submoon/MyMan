import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";

export default class CahLeaveCommand extends BaseCommand {

    static get description() {
        return  {
            text: "Allows to leave a cah game",
            usage: "cah_leave",
        } as IDescription;
    }

    public async run() {
        const channelId = this.message.channel.id;
        const user = this.message.author;
        gameManager.playerLeave(channelId, user.id).then(() => {
            this.message.channel.send(`Player ${user} left the game`);
        }).catch((error) => {
            this.message.channel.send("Error: " + error);
        });
    }
}