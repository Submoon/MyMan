"use strict";

const yt = require('../model/youtube');
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
        let message = this.message;
        let url = this.args.join(" ");
        let p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(!url.match(p)){
            message.channel.send("You need to send a youtube link");
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
                        yt.play(url, broadcast, vC.connection, message);
                    })
                    .catch(console.error);
                }
                else{
                    yt.play(url, broadcast, vC.connection, message);
                }
            }
            else {
                message.channel.send("You need to be on a voice channel");
            }
        }
    }
}


    