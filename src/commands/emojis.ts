import axios, { AxiosRequestConfig } from "axios";
import { Message } from "discord.js";
import { Dropbox } from "dropbox";
import * as e6p from "es6-promise";
(e6p as any).polyfill();
import JSZip = require("jszip");

import "isomorphic-fetch";
import { IDescription, IExtendedClient } from "../api";
import BaseCommand from "../basecommand";
import logger from "../utils/logger";

export default class EmojiCommand extends BaseCommand {
    public constructor(
        client: IExtendedClient,
        message: Message,
        args: string[]
    ) {
        super(client, message, args);
    }

    static get description(): IDescription {
        return {
            text: "Saves the emojis of this guild and uploads them to Dropbox",
            usage: "emojis",
        };
    }

    public async run() {
        const dbx = new Dropbox({
            accessToken: this.client.config.dropboxAccessToken,
        });
        const zip = new JSZip();
        const guild = this.message.guild;
        logger.info(`Processing emojis of guild ${guild}...`);
        for (const emoji of guild.emojis.array()) {
            const urlArray = emoji.url.split(".");
            const ext = urlArray[urlArray.length - 1];
            logger.debug(`Downloading emoji ${emoji.url}`);

            const result = await axios.request({
                headers: {
                    "Content-Type": "image",
                },
                method: "get",
                responseType: "arraybuffer",
                url: emoji.url,
            });

            const name = emoji.name;
            zip.file(`${name}.${ext}`, result.data);
            logger.debug(`Added emoji ${name} to zip file`);
        }
        logger.debug(`Generating zip file...`);
        const content = await zip.generateAsync({ type: "nodebuffer" });
        const chemin = `/${guild.name}.zip`;
        const uploadArgs: DropboxTypes.files.CommitInfo = {
            contents: content,
            mode: { ".tag": "overwrite" },
            path: chemin,
        };

        const fileMetadata = await dbx.filesUpload(uploadArgs);
        logger.info(`Uploaded zip file to ${chemin}`);
        const shareArgs: DropboxTypes.sharing.CreateSharedLinkArg = {
            path: chemin,
            short_url: true,
        };

        const sharing = await dbx.sharingCreateSharedLink(shareArgs);
        this.message.author.send(sharing.url);
        logger.info(`Sent sharing link to user ${this.message.author}`);
    }
}
