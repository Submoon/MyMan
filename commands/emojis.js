"use strict";
const axios = require("axios");
const fs = require("fs");
const Dropbox = require("dropbox");
module.exports = class EmojiCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Saves the emojis of this guild",
            usage: "emojis"
        };
    }

    async run() {
        var dbx = new Dropbox({ accessToken: this.client.config.dropboxAccessToken });

        // let path =  './emojis';
        // if (!fs.existsSync(path)){
        //     fs.mkdirSync(path);
        // }
        // A remplacer par la vérif de dossier de dropbox/création de dossier
        let guild = this.message.guild;
        guild.emojis.forEach(emoji => {
            let urlArray = emoji.url.split(".");
            let ext = urlArray[urlArray.length-1];
           axios.request({
            responseType: 'arraybuffer',
            url: emoji.url,
            method: 'get',
            headers: {
            'Content-Type': 'image',
            }
            }).then((result) => {
                let name = emoji.name;
                let path =  `./emojis/${guild.name}/`;
                const outputFilename = `${path}/${name}.${ext}`;
                // fs.writeFile(outputFilename, result.data, (err) =>{
                //     if(err) console.error(err);
                // });
                // A remplacer par l'écriture de fichier sur dropbox
    
            });
      
        });
    }



}