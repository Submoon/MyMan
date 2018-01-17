"use strict";
const axios = require("axios");
const fs = require("fs");
module.exports = class EmojiCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Pings the server",
            usage: "ping"
        };
    }

    async run() {
        
       this.message.guild.emojis.forEach(emoji =>axios.request({
        responseType: 'arraybuffer',
        url: emoji.url,
        method: 'get',
        headers: {
          'Content-Type': 'image',
        },
      }).then((result) => {
        let name = emoji.name;
        let path =  '/Users/Maxime/Desktop/MyMan/emojis/';
        const outputFilename = path+name+'.png';
        fs.writeFileSync(outputFilename, result.data);
        return outputFilename;
      }))
      
        }
    }



    