"use strict";
const axios = require("axios");
const fs = require("fs");
module.exports = class EmojiCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    

    async run() {
        let path =  './emojis';
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
       this.message.guild.emojis.forEach(emoji =>axios.request({
        responseType: 'arraybuffer',
        url: emoji.url,
        method: 'get',
        headers: {
          'Content-Type': 'image',
        },
      }).then((result) => {
        let name = emoji.name;
        let path =  './emojis/';
        const outputFilename = path+'/'+name+'.png';
        fs.writeFile(outputFilename, result.data, (err) =>{
            if(err) console.error(err);
            
    
      });
      
        }
      ))}



}