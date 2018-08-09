"use strict";
const color = require("../../utils/constants").colorok;

module.exports = class ColorListCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sends the list of colors accepted by color_set",
            usage: "color_list"
        };
    }

    async run() {
        this.message.channel.send(color);
    }
}    