"use strict";

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
        this.message.channel.send("DEFAULT, AQUA, GREEN, BLUE, PURPLE, GOLD, ORANGE, RED, GREY, NAVY, DARK_AQUA, DARK_GREEN, DARK_BLUE, DARK_PURPLE, DARK_GOLD, DARK_ORANGE, DARK_RED, DARK_GREY, DARKER_GREY, LIGHT_GREY, DARK_NAVY, BLURPLE, GREYPLE, DARK_BUT_NOT_BLACK, NOT_QUITE_BLACK, RANDOM");
    }
}    