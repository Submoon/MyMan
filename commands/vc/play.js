"use strict";
const ytdl = require('ytdl-core');
const queue = require('../model/database').queue;
const streamOptions = { seek: 0, volume: 1 };



module.exports = class PlayCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Makes the bot join your vocal channel and play music from a Youtube video",
            usage: "vc_play youtubelink"
        };
    }

    async run() {
        let broadcast = this.client.createVoiceBroadcast();
        let url = this.args.join(" ");
        let p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(!url.match(p)){
            this.message.channel.send("You need to send a youtube link");
            return;
        }
        else{  
            let Bot = this.message.guild.member(this.client.user.id);
            let vCb = Bot.voiceChannel;
            let member = this.message.member;
            let vC = member.voiceChannel;
            if(vC){
                if(vC!=vCb){
                    vC.join()
                    .then(connection => {
                        const stream = ytdl(url, { filter : 'audioonly' });
                        broadcast.playStream(stream);
                        const dispatcher = connection.playBroadcast(broadcast);
                    })
                    .catch(console.error);
                }
                else{
                    const stream = ytdl(url, { filter : 'audioonly' });
                    broadcast.playStream(stream);
                    const dispatcher = vC.connection.playBroadcast(broadcast); 
                }
            }
            else {
                this.message.channel.send("You need to be on a voice channel");
            }
        }
    }
}


    