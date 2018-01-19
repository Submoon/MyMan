"use strict";

module.exports = class NewChannelCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }
/*
    static get description(){
        return  {
            text:"Pings the server",
            usage: "ping"
        };
    }*/

    async run() {
        let guild = this.message.guild;
        let cat = false;
        let id;
        let argsSeperated = this.args.join(" ").split(";");
        let [name, type] = argsSeperated.shift().split(" ");
        let parent = argsSeperated.shift();
        let topic = argsSeperated.shift();
        
       let chan = await guild.createChannel(name,type)

       
        for(let [key, channel] of guild.channels) {
            if(channel.type == null&&channel.name == parent){
                cat = true;
                id = key;
            }
                
        }
                 
        if(cat)
            chan.setParent(id);
        else{
            let par = await guild.createChannel(parent, 'category');
            chan.setParent(par);
        }
       
        chan.setTopic(topic);
        
       
        
      
        
    }



}