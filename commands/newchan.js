"use strict";
const logger = require("../utils/logger");

module.exports = class NewChannelCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Creates a new channel (text voice or category), sets the topic and puts the channel in the given category",
            usage: "newchan option; name; topic; parent"
        }
    }

    async run() {
        let guild = this.message.guild;
        let cat = false;
        let id;
        let argsSeperated = this.args.join(" ").split(";");
        let type = argsSeperated.shift();
        let name = argsSeperated.shift();
        let topic = argsSeperated.shift();
        let parent = argsSeperated.shift();
        let chan;
        try{
             chan = await guild.createChannel(name,type)
        }   
        catch(error){
            logger.error(error);
            this.message.channel.send("Use only alphanumerical characters for the name of the text channel");
            return;
        }
        chan.setTopic(topic);
        if(parent&&type!='category'){
            let parentFound = guild.channels.find(channel => channel.type==null && channel.name.toLowerCase() == parent.toLowerCase());        
            if(parentFound){
                logger.debug(`Found parent ${parentFound}, setting it as a parent for channel${chan}`);
                chan.setParent(parentFound.id);
            }else{
                let par = await guild.createChannel(parent, 'category');
                logger.debug(`Parent ${par} created, setting it as a parent for channel${chan}`);
                await chan.setParent(par);
            }
        }
        logger.info(`Channel created : ${chan}`);
        this.message.channel.send(`Channel created : ${chan}`);
    }
}