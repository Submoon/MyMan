import { IDescription } from "../../api";
import BaseCommand from "../../basecommand";

export default class CahPickCommand extends BaseCommand {

    static get description() {
        return {
            text: "Allows to choose one or multiple cards to be played",
            usage: "cah_pick {x} {y}",
        } as IDescription;
    }

    public async run() {
        this.message.channel.send("Not implemented yet!");
    }
}
