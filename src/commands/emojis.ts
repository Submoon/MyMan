"use strict";
import axios, { AxiosRequestConfig } from 'axios';
import JSZip = require("jszip");
import logger from '../utils/logger';
import {IExtendedClient, BaseCommand} from '../api';
import {Dropbox} from 'dropbox';

export default class EmojiCommand extends BaseCommand{

    constructor(client, message, args){
        super(client, message, args);
    }

    static get description(){
        return  {
            text:"Saves the emojis of this guild and uploads them to Dropbox",
            usage: "emojis"
        };
    }

    async run() {
        var dbx = new Dropbox({ accessToken: this.client.config.dropboxAccessToken } as DropboxTypes.DropboxOptions);
        var zip = new JSZip();
        let guild = this.message.guild;
        logger.info(`Processing emojis of guild ${guild}...`);
        for(let [key, emoji] of guild.emojis) {
            let urlArray = emoji.url.split(".");
            let ext = urlArray[urlArray.length-1];
            logger.debug(`Downloading emoji ${emoji.url}`);

            let result = await axios.request({
                responseType: 'arraybuffer',
                url: emoji.url,
                method: 'get',
                headers: {
                'Content-Type': 'image',
                }
            } as AxiosRequestConfig);

            let name = emoji.name;
            zip.file(`${name}.${ext}`, result.data);
            logger.debug(`Added emoji ${name} to zip file`);
            
            
        }
        logger.debug(`Generating zip file...`);
        let content = await zip.generateAsync({type:"nodebuffer"});
        let chemin = `/${guild.name}.zip`;
        let uploadArgs = <DropboxTypes.files.CommitInfo>{
            contents : content,
            path : chemin,
            mode:{".tag":"overwrite"}
        };

        let fileMetadata = await dbx.filesUpload(uploadArgs);
        logger.info(`Uploaded zip file to ${chemin}`);
        let shareArgs = <DropboxTypes.sharing.CreateSharedLinkArg>{
            path : chemin,
            short_url : true
        };
        
        let sharing = await dbx.sharingCreateSharedLink(shareArgs);
        this.message.author.send(sharing.url);
        logger.info(`Sent sharing link to user ${this.message.author}`);
    }
}