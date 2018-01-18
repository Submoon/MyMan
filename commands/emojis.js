"use strict";
const axios = require("axios");
const fs = require("fs");
const Dropbox = require("dropbox");
const JSZip = require("jszip");
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
        var zip = new JSZip();
        // let path =  './emojis';
        // if (!fs.existsSync(path)){
        //     fs.mkdirSync(path);
        // }
        // A remplacer par la vérif de dossier de dropbox/création de dossier
        let guild = this.message.guild;
        for(let [key, emoji] of guild.emojis) {
            let urlArray = emoji.url.split(".");
            let ext = urlArray[urlArray.length-1];
            let result = await axios.request({
            responseType: 'arraybuffer',
            url: emoji.url,
            method: 'get',
            headers: {
            'Content-Type': 'image',
            }
            })
                let name = emoji.name;
               // let path =  `./emojis/${guild.name}/`;
                zip.file(`${name}.${ext}`, result.data);
                
                // fs.writeFile(outputFilename, result.data, (err) =>{
                //     if(err) console.error(err);
                // });
                // A remplacer par l'écriture de fichier sur dropbox
               
            
            
        }
       let content = await zip.generateAsync({type:"nodebuffer"})
        
            console.log("bite");
            let uploadArgs = {
                contents : content,
                path : guild.name+".zip"
                
                }
          let wait = await dbx.filesUpload(content);
            console.log("couille");
        
        
    }



}