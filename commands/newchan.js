"use strict";

module.exports = class NewChannelCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Creates a new channel (text voice or category), sets the topic and puts the channel in the given category",
            usage: "newchan name option; topic; parent"
        }
    }

    async run() {
        let guild = this.message.guild;
        let cat = false;
        let id;
        let argsSeperated = this.args.join(" ").split(";");
        let [name, type] = argsSeperated.shift().split(" ");
        let topic = argsSeperated.shift();
        let parent = argsSeperated.shift();
        
        let chan = await guild.createChannel(name,type)
        chan.setTopic(topic);
        if(parent&&type!='category'){
            let parentFound = guild.channels.find(channel => channel.type==null && channel.name.toLowerCase() == parent.toLowerCase());        
            if(parentFound)
            chan.setParent(parentFound.id);
            else{
                let par = await guild.createChannel(parent, 'category');
                chan.setParent(par);
            }
        }
        this.message.channel.send(`Channel created : ${chan}`);
    }
}