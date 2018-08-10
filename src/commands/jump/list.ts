import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import {dispoList as dispo} from "../model/database";

export default class JumpListCommand extends BaseCommand {

    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return  {
            text: "Returns a list of users who are available.",
            usage: "jump_list",
        } as IDescription;
    }

    public async run() {
        let hits = 0;

        for (const [key, value] of dispo) {
            if (value === 1 && this.message.guild === key.guild) {
                hits++;
            }
          }

        if (dispo.size && hits > 0) {
            this.message.channel.send("Here is the list of all available players : ");
            // We are going through the 'dispo' map to return only the players with the disponibility value '1'.
            for (const [key, value] of dispo) {
                if (value === 1 && this.message.guild === key.guild) {
                    this.message.channel.send("**" + key.user.username + "**");
                }
              }
        } else {
            this.message.channel.send("There is no one available at the moment.");
        }

    }
}
