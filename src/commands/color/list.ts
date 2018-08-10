"use strict";
import { Message } from "discord.js";
import { IDescription, IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import Constants from "../../utils/constants";
const colorsOk = Constants.COLORSOK;

export default class ColorListCommand extends BaseCommand {

    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return  {
            text: "Sends the list of colors accepted by color_set",
            usage: "color_list",
        } as IDescription;
    }

    public async run() {
        this.message.channel.send(colorsOk);
    }
}
