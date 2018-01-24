"use strict";
const queue = require('../model/database').queue;
const streamOptions = { seek: 0, volume: 1 };



module.exports = class QueueCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Makes the bot join your vocal channel and play music from a Youtube video",
            usage: "vc_play youtubelink"
        }
    }

    async run() {
        let url = this.args.join(" ");
        let guildId = this.message.guild.id;
        let array = queue.get(guildId);
        let p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(!url){
            if(!array||array.length===0){
                this.message.channel.send("The queue is empty");
            }
            else{
                let i;
                for(i=0; i<array.length; i++){
                    this.message.channel.send(`N°${i+1} : ${array[i]}`);
                }
            }
        }
        else if(!url.match(p)){
            this.message.channel.send("You need to send a youtube link");
            return;
        }
        else{  
            if(!array){
                let arr = [url];
                queue.set(guildId, arr);
                this.message.channel.send(`Added to the queue`);
            }
            else if(array.length<2){
                array.push(url);
                this.message.channel.send(`Added to the queue`);
            }
            else{
                this.message.channel.send("The queue is full");
            }
        }
    }
}   