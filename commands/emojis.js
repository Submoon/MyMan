"use strict";
const axios = require("axios");
const fs = require("fs");
const Dropbox = require("dropbox");
const JSZip = require("jszip");
const logger = require("../utils/logger");

module.exports = class EmojiCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Saves the emojis of this guild and uploads them to Dropbox",
            usage: "emojis"
        };
    }

    async run() {
        var dbx = new Dropbox({ accessToken: this.client.config.dropboxAccessToken });
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
            });

            let name = emoji.name;
            zip.file(`${name}.${ext}`, result.data);
            logger.debug(`Added emoji ${name} to zip file`);
            
            
        }
        logger.debug(`Generating zip file...`);
        let content = await zip.generateAsync({type:"nodebuffer"});
        let chemin = `/${guild.name}.zip`;
        let uploadArgs = {
            contents : content,
            path : chemin,
            mode:{".tag":"overwrite"}
            
        };
        let fileMetadata = await dbx.filesUpload(uploadArgs);
        console.info(`Uploaded zip file to ${chemin}`);
        let shareArgs = {
            path : chemin,
            short_url : true
        };
        
        let sharing = await dbx.sharingCreateSharedLink(shareArgs);
        this.message.author.send(sharing.url);
        console.info(`Sent sharing link to user ${this.message.author}`);
    }



}