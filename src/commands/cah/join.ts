import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";
import gameManager from "../../models/cah/gamemanager";
import logger from "../../utils/logger";

export default class CardJoinSubCommand extends BaseCommand {
    static get description(): IDescription {
        return {
            text: "Allows to join a cah game",
            usage: "cah_join",
        };
    }

    public async run() {
        const channelId = this.message.channel.id;
        const user = this.message.author;
        gameManager
            .joinGame(channelId, user)
            .then((player) => {
                this.message.channel.send(
                    `Player ${player.user} joined the game`
                );
                // TODO: Remove when not debugging
                // const embed = player.printCards();
                // user.send({embed});
            })
            .catch((ex: Error) => {
                logger.error(ex.message);
                this.message.channel.send("Error: " + ex.message);
            });
    }
}
