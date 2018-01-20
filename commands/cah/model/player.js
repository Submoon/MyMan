"use strict";
// const TurnDown = require("turndown");
const cheerio = require('cheerio');
const Discord = require("discord.js");

module.exports =  class Player{
    constructor(user){
        this.user = user;
        this.cards = [];
    }

    drawCard(card){
        this.cards.push(card);
    }

    printCards(){
        // let text = "```Markdown\n";

        let embed = new Discord.RichEmbed()
        .setAuthor(this.user.username, this.user.avatarURL)
        .setColor(0x00AE86)
        .setTitle("Your cards");
        

        let text = "";
        // let turndown = new TurnDown();
        for(let i=0; i<this.cards.length; i++){
            let card = this.cards[i];
            let $ = cheerio.load("<div>card</div>");
            if(!$("b").empty()){
                embed = embed.addField(`${i} : ${$("b").text()}`, $("small").text())
            }else{
                embed = embed.addField(`${i} : ${card}`, card);
            }

            // let markdown = turndown.turndown(card);
            // let cardWithoutdHtml = card.replace(/<[^>]+>/g, '');
            // text += `${i} : ${markdown}\n`;
        }
        // text += "```";
        return embed;
    }

}